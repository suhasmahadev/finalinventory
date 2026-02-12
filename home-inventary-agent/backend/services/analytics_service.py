# backend/services/analytics_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict
from datetime import date

from repos.analytics_repo import AnalyticsRepo
from repos.inventory_repo import InventoryRepo


class AnalyticsService:

    def __init__(self):
        self.analytics_repo = AnalyticsRepo()
        self.inventory_repo = InventoryRepo()

    async def get_total_sold_today(
        self,
        db: AsyncSession,
    ) -> Dict:

        total = await self.analytics_repo.get_total_sold_today(db)

        return {
            "date": str(date.today()),
            "total_sold": float(total),
        }

    async def get_total_revenue_today(
        self,
        db: AsyncSession,
    ) -> Dict:

        revenue = await self.analytics_repo.get_total_revenue_today(db)

        return {
            "date": str(date.today()),
            "total_revenue": float(revenue),
        }

    async def get_top_selling_items_today(
        self,
        db: AsyncSession,
        limit: int = 5,
    ) -> Dict:

        rows = await self.analytics_repo.get_top_selling_items_today(
            db=db,
            limit=limit,
        )

        if not rows:
            return {
                "date": str(date.today()),
                "data": [],
            }

        item_ids = [row["item_id"] for row in rows]

        items = await self.inventory_repo.get_items_by_ids(
            db=db,
            item_ids=item_ids,
        )

        item_map = {item.id: item for item in items}

        enriched = []

        for row in rows:
            item = item_map.get(row["item_id"])
            if item:
                enriched.append({
                    "item_id": item.id,
                    "name": item.name,
                    "sku": item.sku,
                    "total_sold": float(row["total_sold"]),
                })

        return {
            "date": str(date.today()),
            "data": enriched,
        }

    async def get_least_selling_items_today(
        self,
        db: AsyncSession,
        limit: int = 5,
    ) -> Dict:

        rows = await self.analytics_repo.get_least_selling_items_today(
            db=db,
            limit=limit,
        )

        if not rows:
            return {
                "date": str(date.today()),
                "data": [],
            }

        item_ids = [row["item_id"] for row in rows]

        items = await self.inventory_repo.get_items_by_ids(
            db=db,
            item_ids=item_ids,
        )

        item_map = {item.id: item for item in items}

        enriched = []

        for row in rows:
            item = item_map.get(row["item_id"])
            if item:
                enriched.append({
                    "item_id": item.id,
                    "name": item.name,
                    "sku": item.sku,
                    "total_sold": float(row["total_sold"]),
                })

        return {
            "date": str(date.today()),
            "data": enriched,
        }

    async def get_items_expiring_within(
        self,
        db: AsyncSession,
        days: int,
    ) -> Dict:

        batches = await self.analytics_repo.get_items_expiring_within(
            db=db,
            days=days,
        )

        if not batches:
            return {
                "within_days": days,
                "count": 0,
                "data": [],
            }

        item_ids = list({batch.item_id for batch in batches})

        items = await self.inventory_repo.get_items_by_ids(
            db=db,
            item_ids=item_ids,
        )

        item_map = {item.id: item for item in items}

        result = []

        for batch in batches:
            item = item_map.get(batch.item_id)
            if item:
                result.append({
                    "item_name": item.name,
                    "sku": item.sku,
                    "batch_id": batch.id,
                    "expiry_date": str(batch.expiry_date),
                    "quantity_available": float(batch.quantity_available),
                })

        return {
            "within_days": days,
            "count": len(result),
            "data": result,
        }

    async def get_total_stock_per_item(
        self,
        db: AsyncSession,
    ) -> Dict:

        rows = await self.analytics_repo.get_total_stock_per_item(db)

        if not rows:
            return {
                "count": 0,
                "data": [],
            }

        item_ids = [row["item_id"] for row in rows]

        items = await self.inventory_repo.get_items_by_ids(
            db=db,
            item_ids=item_ids,
        )

        item_map = {item.id: item for item in items}

        result = []

        for row in rows:
            item = item_map.get(row["item_id"])
            if item:
                result.append({
                    "item_id": item.id,
                    "item_name": item.name,
                    "sku": item.sku,
                    "total_stock": float(row["total_stock"]),
                })

        return {
            "count": len(result),
            "data": result,
        }

    async def get_dead_stock(
        self,
        db: AsyncSession,
        days: int = 30,
    ) -> Dict:

        item_ids = await self.analytics_repo.get_dead_stock(db, days)

        if not item_ids:
            return {
                "days_without_movement": days,
                "count": 0,
                "data": [],
            }

        items = await self.inventory_repo.get_items_by_ids(
            db=db,
            item_ids=item_ids,
        )

        result = [
            {
                "item_id": item.id,
                "item_name": item.name,
                "sku": item.sku,
            }
            for item in items
        ]

        return {
            "days_without_movement": days,
            "count": len(result),
            "data": result,
        }

    async def get_stock_turnover(
        self,
        db: AsyncSession,
        item_id: int,
        days: int = 30,
    ) -> Dict:

        history = await self.analytics_repo.get_daily_sales_history(
            db=db,
            item_id=item_id,
            days=days,
        )

        total_sold = sum(float(entry.qty_sold) for entry in history)

        current_stock = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        turnover = 0
        if current_stock > 0:
            turnover = total_sold / current_stock

        return {
            "item_id": item_id,
            "period_days": days,
            "total_sold": total_sold,
            "current_stock": float(current_stock),
            "turnover_ratio": round(turnover, 4),
        }

    async def get_daily_sales_history(
        self,
        db: AsyncSession,
        item_id: int,
        days: int = 30,
    ) -> Dict:

        history = await self.analytics_repo.get_daily_sales_history(
            db=db,
            item_id=item_id,
            days=days,
        )

        result = [
            {
                "date": str(entry.date),
                "qty_sold": float(entry.qty_sold),
            }
            for entry in history
        ]

        return {
            "item_id": item_id,
            "days": days,
            "data": result,
        }
