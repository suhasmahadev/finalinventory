# backend/services/analytics_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Dict, List
from datetime import date

from repos.analytics_repo import AnalyticsRepo
from repos.inventory_repo import InventoryRepo


class AnalyticsService:

    def __init__(self):
        self.analytics_repo = AnalyticsRepo()
        self.inventory_repo = InventoryRepo()

    # ---------------------------------------------------
    # TOTAL SOLD TODAY
    # ---------------------------------------------------
    async def get_total_sold_today(
        self,
        db: AsyncSession,
    ) -> Dict:

        total = await self.analytics_repo.get_total_sold_today(db)

        return {
            "date": str(date.today()),
            "total_sold": float(total),
        }

    # ---------------------------------------------------
    # TOP SELLING ITEMS TODAY (OPTIMIZED)
    # ---------------------------------------------------
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
                    "item_id": str(item.id),
                    "name": item.name,
                    "sku": item.sku,
                    "total_sold": float(row["total_sold"]),
                })

        return {
            "date": str(date.today()),
            "data": enriched,
        }

    # ---------------------------------------------------
    # LEAST SELLING ITEMS TODAY (OPTIMIZED)
    # ---------------------------------------------------
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
                    "item_id": str(item.id),
                    "name": item.name,
                    "sku": item.sku,
                    "total_sold": float(row["total_sold"]),
                })

        return {
            "date": str(date.today()),
            "data": enriched,
        }

    # ---------------------------------------------------
    # EXPIRING SOON
    # ---------------------------------------------------
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
                    "batch_id": str(batch.id),
                    "expiry_date": str(batch.expiry_date),
                    "quantity_available": float(batch.quantity_available),
                })

        return {
            "within_days": days,
            "count": len(result),
            "data": result,
        }

    # ---------------------------------------------------
    # TOTAL STOCK PER ITEM
    # ---------------------------------------------------
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
                    "item_name": item.name,
                    "sku": item.sku,
                    "total_stock": float(row["total_stock"]),
                })

        return {
            "count": len(result),
            "data": result,
        }

    # ---------------------------------------------------
    # DAILY SALES HISTORY (ML READY)
    # ---------------------------------------------------
    async def get_daily_sales_history(
        self,
        db: AsyncSession,
        item_id: UUID,
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
            "item_id": str(item_id),
            "days": days,
            "data": result,
        }
