from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import date
import random

from repos.inventory_repo import InventoryRepo
from repos.stock_movement_repo import StockMovementRepo
from repos.warehouse_repo import WarehouseRepo
from models.schema import MovementType


class InventoryService:

    def __init__(self):
        self.inventory_repo = InventoryRepo()
        self.movement_repo = StockMovementRepo()
        self.warehouse_repo = WarehouseRepo()

    # ===================================================
    # CREATE ITEM (AUTO SKU IF NOT PROVIDED)
    # ===================================================
    async def create_item(
        self,
        db: AsyncSession,
        name: str,
        sku: Optional[str],
        category_id: Optional[int],
        unit: Optional[str],
        reorder_threshold: Optional[float],
        lead_time_days: Optional[int],
    ):

        if not sku:
            while True:
                generated_sku = f"ITEM-{random.randint(100000, 999999)}"
                existing = await self.inventory_repo.get_item_by_sku(db, generated_sku)
                if not existing:
                    sku = generated_sku
                    break

        return await self.inventory_repo.create_item(
            db=db,
            name=name,
            sku=sku,
            category_id=category_id,
            unit=unit,
            reorder_threshold=reorder_threshold,
            lead_time_days=lead_time_days,
        )

    # ===================================================
    # ADD STOCK (ROOM BASED + LEDGER IN)
    # ===================================================
    async def add_stock(
        self,
        db: AsyncSession,
        item_id: int,
        quantity: float,
        room_id: int,
        batch_number: Optional[str],
        expiry_date: Optional[date],
        purchase_price: Optional[float],
        reference_type: str = "MANUAL",
        reference_id: Optional[str] = None,
    ):

        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        room = await self.warehouse_repo.get_room_by_id(db, room_id)
        if not room:
            raise ValueError("Invalid room")

        batch = await self.inventory_repo.create_batch(
            db=db,
            item_id=item_id,
            room_id=room_id,
            warehouse_id=room.warehouse_id,
            batch_number=batch_number,
            quantity=quantity,
            expiry_date=expiry_date,
            purchase_price=purchase_price,
        )

        await self.movement_repo.create_movement(
            db=db,
            item_id=item_id,
            batch_id=batch.id,
            quantity=quantity,
            movement_type=MovementType.IN,
            warehouse_id=room.warehouse_id,
            room_id=room_id,
            reference_type=reference_type,
            reference_id=reference_id,
        )

        return {
            "batch_id": batch.id,
            "item_id": item_id,
            "added_quantity": float(quantity)
        }

    # ===================================================
    # DEDUCT STOCK (FIFO + EXPIRY SAFE)
    # ===================================================
    async def deduct_stock(
        self,
        db: AsyncSession,
        item_id: int,
        quantity: float,
        reference_type: str,
        reference_id: Optional[str],
    ):

        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        total_available = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        if total_available < quantity:
            raise ValueError("Insufficient stock")

        remaining = float(quantity)
        tx_id = f"TX-{random.randint(100000, 999999)}"
        today = date.today()

        batches = await self.inventory_repo.get_available_batches_fifo(
            db=db,
            item_id=item_id,
        )

        for batch in batches:

            if remaining <= 0:
                break

            if batch.expiry_date and batch.expiry_date < today:
                continue

            available = float(batch.quantity_available or 0)
            if available <= 0:
                continue

            deduct_amount = min(available, remaining)
            new_quantity = available - deduct_amount

            await self.inventory_repo.update_batch_quantity(
                db=db,
                batch_id=batch.id,
                new_quantity=new_quantity,
            )

            await self.movement_repo.create_movement(
                db=db,
                item_id=item_id,
                batch_id=batch.id,
                quantity=deduct_amount,
                movement_type=MovementType.OUT,
                warehouse_id=batch.warehouse_id,
                room_id=batch.room_id,
                reference_type=reference_type,
                reference_id=reference_id,
            )

            remaining -= deduct_amount

        if remaining > 0:
            raise ValueError("Stock inconsistency detected")

        await self._check_reorder_alert(db, item_id)

        return {
            "status": "success",
            "deducted": float(quantity),
            "transaction_id": tx_id,
        }

    # ===================================================
    # REORDER CHECK
    # ===================================================
    async def _check_reorder_alert(
        self,
        db: AsyncSession,
        item_id: int,
    ):

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item or not item.reorder_threshold:
            return

        total_available = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        if total_available < float(item.reorder_threshold):
            pass

    # ===================================================
    # ITEM STOCK SUMMARY
    # ===================================================
    async def get_item_stock_summary(
        self,
        db: AsyncSession,
        item_id: int,
    ):

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        total_available = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        return {
            "item_id": item.id,
            "name": item.name,
            "sku": item.sku,
            "total_available": float(total_available),
            "reorder_threshold": float(item.reorder_threshold)
            if item.reorder_threshold else None,
        }

    # ===================================================
    # LIST ALL ITEMS WITH TOTAL STOCK
    # ===================================================
    async def get_all_items(self, db: AsyncSession):

        items = await self.inventory_repo.list_items(db)

        result = []
        for item in items:
            total_stock = sum(float(b.quantity_available or 0) for b in item.batches)

            result.append({
                "id": item.id,
                "name": item.name,
                "sku": item.sku,
                "category_id": item.category_id if item.category_id else None,
                "unit": item.unit,
                "total_stock": total_stock,
                "reorder_threshold": float(item.reorder_threshold)
                if item.reorder_threshold else None
            })

        return {
            "count": len(result),
            "data": result
        }
