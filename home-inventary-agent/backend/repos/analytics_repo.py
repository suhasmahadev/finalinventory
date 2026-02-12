# backend/repos/analytics_repo.py

from sqlalchemy import select, func, desc, asc, and_
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from typing import List, Dict

from models.schema import (
    StockMovement,
    InventoryBatch,
    TimeSeriesSales,
    MovementType,
)


class AnalyticsRepo:

    # ============================================================
    # TOTAL SOLD TODAY (QUANTITY)
    # ============================================================
    async def get_total_sold_today(
        self,
        db: AsyncSession
    ) -> float:

        today = date.today()

        result = await db.execute(
            select(
                func.coalesce(func.sum(StockMovement.quantity), 0)
            ).where(
                and_(
                    StockMovement.movement_type == MovementType.OUT,
                    func.date(StockMovement.created_at) == today
                )
            )
        )

        return float(result.scalar() or 0)

    # ============================================================
    # TOTAL REVENUE TODAY (NEW)
    # ============================================================
    async def get_total_revenue_today(
        self,
        db: AsyncSession
    ) -> float:

        today = date.today()

        result = await db.execute(
            select(
                func.coalesce(func.sum(TimeSeriesSales.qty_sold), 0)
            ).where(
                TimeSeriesSales.date == today
            )
        )

        return float(result.scalar() or 0)

    # ============================================================
    # TOP SELLING ITEMS TODAY
    # ============================================================
    async def get_top_selling_items_today(
        self,
        db: AsyncSession,
        limit: int = 5
    ) -> List[Dict]:

        today = date.today()

        result = await db.execute(
            select(
                StockMovement.item_id,
                func.sum(StockMovement.quantity).label("total_sold")
            )
            .where(
                and_(
                    StockMovement.movement_type == MovementType.OUT,
                    func.date(StockMovement.created_at) == today
                )
            )
            .group_by(StockMovement.item_id)
            .order_by(desc(func.sum(StockMovement.quantity)))
            .limit(limit)
        )

        rows = result.all()

        return [
            {"item_id": r.item_id, "total_sold": float(r.total_sold)}
            for r in rows
        ]

    # ============================================================
    # LEAST SELLING ITEMS TODAY (FIXED ORDERING)
    # ============================================================
    async def get_least_selling_items_today(
        self,
        db: AsyncSession,
        limit: int = 5
    ) -> List[Dict]:

        today = date.today()

        result = await db.execute(
            select(
                StockMovement.item_id,
                func.sum(StockMovement.quantity).label("total_sold")
            )
            .where(
                and_(
                    StockMovement.movement_type == MovementType.OUT,
                    func.date(StockMovement.created_at) == today
                )
            )
            .group_by(StockMovement.item_id)
            .order_by(asc(func.sum(StockMovement.quantity)))
            .limit(limit)
        )

        rows = result.all()

        return [
            {"item_id": r.item_id, "total_sold": float(r.total_sold)}
            for r in rows
        ]

    # ============================================================
    # EXPIRING SOON
    # ============================================================
    async def get_items_expiring_within(
        self,
        db: AsyncSession,
        days: int
    ) -> List[InventoryBatch]:

        today = date.today()
        future = today + timedelta(days=days)

        result = await db.execute(
            select(InventoryBatch)
            .where(
                and_(
                    InventoryBatch.expiry_date != None,
                    InventoryBatch.expiry_date <= future,
                    InventoryBatch.quantity_available > 0
                )
            )
            .order_by(InventoryBatch.expiry_date.asc())
        )

        return result.scalars().all()

    # ============================================================
    # TOTAL AVAILABLE STOCK PER ITEM
    # ============================================================
    async def get_total_stock_per_item(
        self,
        db: AsyncSession
    ) -> List[Dict]:

        result = await db.execute(
            select(
                InventoryBatch.item_id,
                func.coalesce(
                    func.sum(InventoryBatch.quantity_available), 0
                ).label("total_stock")
            )
            .group_by(InventoryBatch.item_id)
        )

        rows = result.all()

        return [
            {"item_id": r.item_id, "total_stock": float(r.total_stock)}
            for r in rows
        ]

    # ============================================================
    # DEAD STOCK (NO MOVEMENT IN N DAYS)
    # ============================================================
    async def get_dead_stock(
        self,
        db: AsyncSession,
        days: int = 30
    ) -> List[int]:

        cutoff = date.today() - timedelta(days=days)

        result = await db.execute(
            select(InventoryBatch.item_id)
            .where(
                InventoryBatch.item_id.notin_(
                    select(StockMovement.item_id).where(
                        StockMovement.created_at >= cutoff
                    )
                )
            )
            .distinct()
        )

        return [row.item_id for row in result.all()]

    # ============================================================
    # DAILY SALES HISTORY (ML READY)
    # ============================================================
    async def get_daily_sales_history(
        self,
        db: AsyncSession,
        item_id: int,
        days: int = 30
    ) -> List[TimeSeriesSales]:

        start_date = date.today() - timedelta(days=days)

        result = await db.execute(
            select(TimeSeriesSales)
            .where(
                and_(
                    TimeSeriesSales.item_id == item_id,
                    TimeSeriesSales.date >= start_date
                )
            )
            .order_by(TimeSeriesSales.date.asc())
        )

        return result.scalars().all()
