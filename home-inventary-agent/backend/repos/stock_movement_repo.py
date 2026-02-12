# backend/repos/stock_movement_repo.py

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.schema import StockMovement, MovementType
from typing import Optional, List
from datetime import datetime


class StockMovementRepo:

    # -----------------------------
    # Create Movement Entry
    # -----------------------------
    async def create_movement(
        self,
        db: AsyncSession,
        item_id: int,
        quantity: float,
        movement_type: MovementType,
        batch_id: Optional[int] = None,
        warehouse_id: Optional[int] = None,
        room_id: Optional[int] = None,
        reference_type: Optional[str] = None,
        reference_id: Optional[str] = None,
        created_by: Optional[str] = None,
        tx_id: Optional[str] = None,
    ) -> StockMovement:

        movement = StockMovement(
            item_id=item_id,
            batch_id=batch_id,
            warehouse_id=warehouse_id,
            room_id=room_id,
            movement_type=movement_type,
            quantity=quantity,
            reference_type=reference_type,
            reference_id=reference_id,
            created_by=created_by,
            tx_id=tx_id,
        )

        db.add(movement)
        await db.flush()
        return movement

    # -----------------------------
    # Get movements by item
    # -----------------------------
    async def get_movements_by_item(
        self,
        db: AsyncSession,
        item_id: int
    ) -> List[StockMovement]:

        result = await db.execute(
            select(StockMovement)
            .where(StockMovement.item_id == item_id)
            .order_by(StockMovement.created_at.desc())
        )

        return result.scalars().all()

    # -----------------------------
    # Get movements by date range
    # -----------------------------
    async def get_movements_by_date_range(
        self,
        db: AsyncSession,
        start_date: datetime,
        end_date: datetime,
    ) -> List[StockMovement]:

        result = await db.execute(
            select(StockMovement)
            .where(
                StockMovement.created_at >= start_date,
                StockMovement.created_at <= end_date
            )
            .order_by(StockMovement.created_at.desc())
        )

        return result.scalars().all()
