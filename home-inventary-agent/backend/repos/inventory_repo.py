# backend/repos/inventory_repo.py

from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from models.schema import (
    Item,
    InventoryBatch,
    Category,
)
from uuid import UUID
from typing import Optional, List
from datetime import date


class InventoryRepo:

    # -----------------------------
    # ITEM OPERATIONS
    # -----------------------------

    async def create_item(
        self,
        db: AsyncSession,
        name: str,
        sku: Optional[str],
        category_id: Optional[UUID],
        unit: Optional[str],
        reorder_threshold: Optional[float],
        lead_time_days: Optional[int],
    ) -> Item:

        item = Item(
            name=name,
            sku=sku,
            category_id=category_id,
            unit=unit,
            reorder_threshold=reorder_threshold,
            lead_time_days=lead_time_days,
        )

        db.add(item)
        await db.flush()
        return item

    async def get_item_by_id(
        self,
        db: AsyncSession,
        item_id: UUID
    ) -> Optional[Item]:

        result = await db.execute(
            select(Item).where(Item.id == item_id)
        )
        return result.scalar_one_or_none()

    async def get_item_by_sku(
        self,
        db: AsyncSession,
        sku: str
    ) -> Optional[Item]:

        result = await db.execute(
            select(Item).where(Item.sku == sku)
        )
        return result.scalar_one_or_none()

    async def list_items(
        self,
        db: AsyncSession
    ) -> List[Item]:

        result = await db.execute(
            select(Item).options(selectinload(Item.batches))
        )
        return result.scalars().all()

    # -----------------------------
    # BATCH OPERATIONS
    # -----------------------------

    async def create_batch(
        self,
        db: AsyncSession,
        item_id: UUID,
        room_id: Optional[UUID],
        warehouse_id: Optional[UUID],
        batch_number: Optional[str],
        quantity: float,
        expiry_date: Optional[date],
        purchase_price: Optional[float],
    ) -> InventoryBatch:

        batch = InventoryBatch(
            item_id=item_id,
            room_id=room_id,
            warehouse_id=warehouse_id,
            batch_number=batch_number,
            quantity_total=quantity,
            quantity_available=quantity,
            expiry_date=expiry_date,
            purchase_price=purchase_price,
        )

        db.add(batch)
        await db.flush()
        return batch

    async def get_available_batches_fifo(
        self,
        db: AsyncSession,
        item_id: UUID,
    ) -> List[InventoryBatch]:

        result = await db.execute(
            select(InventoryBatch)
            .where(
                InventoryBatch.item_id == item_id,
                InventoryBatch.quantity_available > 0
            )
            .order_by(
                InventoryBatch.expiry_date.asc().nulls_last(),
                InventoryBatch.created_at.asc()
            )
        )

        return result.scalars().all()

    async def update_batch_quantity(
        self,
        db: AsyncSession,
        batch_id: UUID,
        new_quantity: float
    ) -> None:

        await db.execute(
            update(InventoryBatch)
            .where(InventoryBatch.id == batch_id)
            .values(quantity_available=new_quantity)
        )

    # -----------------------------
    # STOCK AGGREGATION
    # -----------------------------

    async def get_total_available_quantity(
        self,
        db: AsyncSession,
        item_id: UUID
    ) -> float:

        result = await db.execute(
            select(func.coalesce(func.sum(InventoryBatch.quantity_available), 0))
            .where(InventoryBatch.item_id == item_id)
        )

        return float(result.scalar() or 0)

    async def get_expiring_batches(
        self,
        db: AsyncSession,
        days: int
    ) -> List[InventoryBatch]:

        from datetime import date, timedelta

        today = date.today()
        future = today + timedelta(days=days)

        result = await db.execute(
            select(InventoryBatch)
            .where(
                InventoryBatch.expiry_date != None,
                InventoryBatch.expiry_date <= future,
                InventoryBatch.quantity_available > 0
            )
            .order_by(InventoryBatch.expiry_date.asc())
        )

        return result.scalars().all()

    async def get_items_by_ids(
        self,
        db: AsyncSession,
        item_ids: List[UUID]
    ) -> List[Item]:

        if not item_ids:
            return []

        result = await db.execute(
            select(Item).where(Item.id.in_(item_ids))
        )
        return result.scalars().all()