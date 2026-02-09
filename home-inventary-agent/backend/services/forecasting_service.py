# backend/services/forecasting_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Dict, List
from datetime import date, timedelta
import statistics

from repos.analytics_repo import AnalyticsRepo
from repos.inventory_repo import InventoryRepo


class ForecastingService:

    def __init__(self):
        self.analytics_repo = AnalyticsRepo()
        self.inventory_repo = InventoryRepo()

    # ---------------------------------------------------
    # FORECAST NEXT N DAYS USING MOVING AVERAGE
    # ---------------------------------------------------
    async def forecast_demand(
        self,
        db: AsyncSession,
        item_id: UUID,
        history_days: int = 30,
        forecast_days: int = 7,
    ) -> Dict:

        history = await self.analytics_repo.get_daily_sales_history(
            db=db,
            item_id=item_id,
            days=history_days,
        )

        if not history:
            return {
                "item_id": str(item_id),
                "message": "Not enough historical data",
                "forecast": [],
            }

        sales_values = [float(entry.qty_sold) for entry in history]

        if len(sales_values) < 3:
            return {
                "item_id": str(item_id),
                "message": "Insufficient data points for forecasting",
                "forecast": [],
            }

        # Simple Moving Average
        avg_daily_sales = statistics.mean(sales_values)

        forecast_results = []

        for i in range(1, forecast_days + 1):
            forecast_date = date.today() + timedelta(days=i)
            forecast_results.append({
                "date": str(forecast_date),
                "predicted_demand": round(avg_daily_sales, 2),
            })

        return {
            "item_id": str(item_id),
            "history_days_used": len(sales_values),
            "avg_daily_sales": round(avg_daily_sales, 2),
            "forecast_days": forecast_days,
            "forecast": forecast_results,
        }

    # ---------------------------------------------------
    # REORDER SUGGESTION BASED ON FORECAST
    # ---------------------------------------------------
    async def suggest_reorder_quantity(
        self,
        db: AsyncSession,
        item_id: UUID,
        forecast_days: int = 7,
    ) -> Dict:

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        stock_summary = await self.inventory_repo.get_total_available_quantity(
            db=db,
            item_id=item_id,
        )

        forecast = await self.forecast_demand(
            db=db,
            item_id=item_id,
            history_days=30,
            forecast_days=forecast_days,
        )

        if not forecast.get("forecast"):
            return {
                "item_id": str(item_id),
                "message": "Forecast unavailable",
            }

        predicted_total = sum(
            day["predicted_demand"] for day in forecast["forecast"]
        )

        reorder_needed = max(0, predicted_total - stock_summary)

        return {
            "item_id": str(item_id),
            "current_stock": float(stock_summary),
            "predicted_demand_next_days": round(predicted_total, 2),
            "recommended_reorder_quantity": round(reorder_needed, 2),
        }
