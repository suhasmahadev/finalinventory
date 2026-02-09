# backend/services/movement_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid4
from typing import Optional
from datetime import date

from repos.inventory_repo import InventoryRepo
from repos.stock_movement_repo import StockMovementRepo
from models.schema import MovementType


class MovementService:

    def __init__(self):
        self.inventory_repo = InventoryRepo()
        self.movement_repo = StockMovementRepo()

    # ---------------------------------------------------
    # MANUAL ADJUSTMENT (INCREASE OR DECREASE)
    # ---------------------------------------------------
    async def adjust_stock(
        self,
        db: AsyncSession,
        batch_id: UUID,
        adjustment_quantity: float,
        reason: str,
        created_by: Optional[str],
    ):

        if adjustment_quantity == 0:
            raise ValueError("Adjustment quantity cannot be zero")

        async with db.begin():

            batch = await self.inventory_repo.get_batch_by_id(db, batch_id)
            if not batch:
                raise ValueError("Batch not found")

            new_quantity = float(batch.quantity_available) + adjustment_quantity

            if new_quantity < 0:
                raise ValueError("Adjustment would result in negative stock")

            await self.inventory_repo.update_batch_quantity(
                db=db,
                batch_id=batch.id,
                new_quantity=new_quantity,
            )

            movement_type = (
                MovementType.IN if adjustment_quantity > 0 else MovementType.ADJUSTMENT
            )

            await self.movement_repo.create_movement(
                db=db,
                item_id=batch.item_id,
                batch_id=batch.id,
                quantity=abs(adjustment_quantity),
                movement_type=movement_type,
                warehouse_id=batch.warehouse_id,
                room_id=batch.room_id,
                reference_type="ADJUSTMENT",
                reference_id=reason,
                created_by=created_by,
                tx_id=uuid4(),
            )

            return {
                "status": "adjusted",
                "batch_id": str(batch.id),
                "new_quantity": float(new_quantity),
            }

    # ---------------------------------------------------
    # TRANSFER STOCK (ROOM TO ROOM)
    # ---------------------------------------------------
    async def transfer_stock(
        self,
        db: AsyncSession,
        batch_id: UUID,
        target_room_id: UUID,
        quantity: float,
        created_by: Optional[str],
    ):

        if quantity <= 0:
            raise ValueError("Transfer quantity must be positive")

        async with db.begin():

            batch = await self.inventory_repo.get_batch_by_id(db, batch_id)
            if not batch:
                raise ValueError("Batch not found")

            if float(batch.quantity_available) < quantity:
                raise ValueError("Insufficient stock for transfer")

            # Deduct from source
            new_quantity = float(batch.quantity_available) - quantity

            await self.inventory_repo.update_batch_quantity(
                db=db,
                batch_id=batch.id,
                new_quantity=new_quantity,
            )

            # Create new batch in target room
            new_batch = await self.inventory_repo.create_batch(
                db=db,
                item_id=batch.item_id,
                room_id=target_room_id,
                warehouse_id=batch.warehouse_id,
                batch_number=batch.batch_number,
                quantity=quantity,
                expiry_date=batch.expiry_date,
                purchase_price=batch.purchase_price,
            )

            tx_id = uuid4()

            # Ledger OUT
            await self.movement_repo.create_movement(
                db=db,
                item_id=batch.item_id,
                batch_id=batch.id,
                quantity=quantity,
                movement_type=MovementType.TRANSFER,
                warehouse_id=batch.warehouse_id,
                room_id=batch.room_id,
                reference_type="TRANSFER_OUT",
                created_by=created_by,
                tx_id=tx_id,
            )

            # Ledger IN
            await self.movement_repo.create_movement(
                db=db,
                item_id=batch.item_id,
                batch_id=new_batch.id,
                quantity=quantity,
                movement_type=MovementType.TRANSFER,
                warehouse_id=batch.warehouse_id,
                room_id=target_room_id,
                reference_type="TRANSFER_IN",
                created_by=created_by,
                tx_id=tx_id,
            )

            return {
                "status": "transferred",
                "transaction_id": str(tx_id),
            }
