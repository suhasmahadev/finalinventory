# backend/services/inventory_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid4
from typing import Optional
from datetime import date

from repos.inventory_repo import InventoryRepo
from repos.stock_movement_repo import StockMovementRepo
from repos.analytics_repo import AnalyticsRepo
from models.schema import MovementType, Item


class InventoryService:

    def __init__(self):
        self.inventory_repo = InventoryRepo()
        self.movement_repo = StockMovementRepo()
        self.analytics_repo = AnalyticsRepo()

    # ---------------------------------------------------
    # CREATE ITEM
    # ---------------------------------------------------
    async def create_item(
        self,
        db: AsyncSession,
        name: str,
        sku: Optional[str],
        category_id: Optional[UUID],
        unit: Optional[str],
        reorder_threshold: Optional[float],
        lead_time_days: Optional[int],
    ):

        async with db.begin():
            return await self.inventory_repo.create_item(
                db=db,
                name=name,
                sku=sku,
                category_id=category_id,
                unit=unit,
                reorder_threshold=reorder_threshold,
                lead_time_days=lead_time_days,
            )

    # ---------------------------------------------------
    # ADD STOCK (BATCH + LEDGER IN)
    # ---------------------------------------------------
    async def add_stock(
        self,
        db: AsyncSession,
        item_id: UUID,
        quantity: float,
        room_id: Optional[UUID],
        warehouse_id: Optional[UUID],
        batch_number: Optional[str],
        expiry_date: Optional[date],
        purchase_price: Optional[float],
        created_by: Optional[str],
    ):

        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")

        async with db.begin():

            batch = await self.inventory_repo.create_batch(
                db=db,
                item_id=item_id,
                room_id=room_id,
                warehouse_id=warehouse_id,
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
                warehouse_id=warehouse_id,
                room_id=room_id,
                reference_type="MANUAL",
                created_by=created_by,
            )

            return batch

    # ---------------------------------------------------
    # DEDUCT STOCK (FIFO + EXPIRY SAFE + TRANSACTIONAL)
    # ---------------------------------------------------
    async def deduct_stock(
        self,
        db: AsyncSession,
        item_id: UUID,
        quantity: float,
        reference_type: str,
        reference_id: Optional[str],
        created_by: Optional[str],
    ):

        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")

        async with db.begin():

            # -------- PRE-CHECK TOTAL AVAILABLE --------
            total_available = await self.inventory_repo.get_total_available_quantity(
                db=db,
                item_id=item_id,
            )

            if total_available < quantity:
                raise ValueError("Insufficient stock")

            remaining = quantity
            tx_id = uuid4()
            today = date.today()

            # -------- FETCH FIFO BATCHES --------
            batches = await self.inventory_repo.get_available_batches_fifo(
                db=db,
                item_id=item_id,
            )

            for batch in batches:

                if remaining <= 0:
                    break

                # Skip expired batches
                if batch.expiry_date and batch.expiry_date < today:
                    continue

                available = float(batch.quantity_available)

                if available <= 0:
                    continue

                deduct_amount = min(available, remaining)
                new_quantity = available - deduct_amount

                # Update batch quantity
                await self.inventory_repo.update_batch_quantity(
                    db=db,
                    batch_id=batch.id,
                    new_quantity=new_quantity,
                )

                # Write ledger
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
                    created_by=created_by,
                    tx_id=tx_id,
                )

                remaining -= deduct_amount

            if remaining > 0:
                raise ValueError("Stock inconsistency detected")

            # -------- CHECK REORDER THRESHOLD --------
            await self._check_reorder_alert(db, item_id)

            return {
                "status": "success",
                "deducted": quantity,
                "transaction_id": str(tx_id),
            }

    # ---------------------------------------------------
    # CHECK REORDER LEVEL
    # ---------------------------------------------------
    async def _check_reorder_alert(
        self,
        db: AsyncSession,
        item_id: UUID,
    ):

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item or not item.reorder_threshold:
            return

        total_available = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        if total_available < float(item.reorder_threshold):
            # Hook for future alert system
            # You can insert into alerts table here
            pass

    # ---------------------------------------------------
    # GET ITEM WITH TOTAL STOCK
    # ---------------------------------------------------
    async def get_item_stock_summary(
        self,
        db: AsyncSession,
        item_id: UUID,
    ):

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        total_available = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        return {
            "item_id": str(item.id),
            "name": item.name,
            "sku": item.sku,
            "total_available": float(total_available),
            "reorder_threshold": float(item.reorder_threshold)
            if item.reorder_threshold
            else None,
        }

    # ---------------------------------------------------
    # LIST ALL ITEMS
    # ---------------------------------------------------
    async def get_all_items(
        self,
        db: AsyncSession,
    ):
        items = await self.inventory_repo.list_items(db)
        
        # Optimize: get batch aggregates in one query ideally, but here we loop for simplicity unless specific repo method exists
        # Repo has list_items which selectinloads batches.
        # We can compute total stock from loaded batches.
        
        result = []
        for item in items:
            total_stock = sum(b.quantity_available for b in item.batches)
            result.append({
                "id": str(item.id),
                "name": item.name,
                "sku": item.sku,
                "category_id": str(item.category_id) if item.category_id else None,
                "unit": item.unit,
                "total_stock": float(total_stock),
                "reorder_threshold": float(item.reorder_threshold) if item.reorder_threshold else None
            })
            
        return {
            "count": len(result),
            "data": result
        }
