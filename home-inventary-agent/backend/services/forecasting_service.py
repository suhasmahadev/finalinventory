# backend/services/forecasting_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict
from datetime import date, timedelta
import statistics

from repos.analytics_repo import AnalyticsRepo
from repos.inventory_repo import InventoryRepo


class ForecastingService:

    def __init__(self):
        self.analytics_repo = AnalyticsRepo()
        self.inventory_repo = InventoryRepo()

    # =========================================================
    # FORECAST DEMAND (MOVING AVERAGE + SIMPLE TREND)
    # =========================================================
    async def forecast_demand(
        self,
        db: AsyncSession,
        item_id: int,
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
                "item_id": item_id,
                "message": "Not enough historical data",
                "forecast": [],
            }

        sales_values = [float(entry.qty_sold) for entry in history]

        if len(sales_values) < 3:
            return {
                "item_id": item_id,
                "message": "Insufficient data points for forecasting",
                "forecast": [],
            }

        # -------------------------------
        # Moving Average
        # -------------------------------
        avg_daily_sales = statistics.mean(sales_values)

        # -------------------------------
        # Simple Trend Detection
        # -------------------------------
        first_half = sales_values[: len(sales_values) // 2]
        second_half = sales_values[len(sales_values) // 2 :]

        trend_adjustment = 0
        if first_half and second_half:
            first_avg = statistics.mean(first_half)
            second_avg = statistics.mean(second_half)
            trend_adjustment = (second_avg - first_avg) / max(len(sales_values), 1)

        forecast_results = []

        for i in range(1, forecast_days + 1):
            forecast_date = date.today() + timedelta(days=i)

            predicted = avg_daily_sales + (trend_adjustment * i)

            forecast_results.append({
                "date": str(forecast_date),
                "predicted_demand": round(max(predicted, 0), 2),
            })

        return {
            "item_id": item_id,
            "history_days_used": len(sales_values),
            "avg_daily_sales": round(avg_daily_sales, 2),
            "trend_adjustment_per_day": round(trend_adjustment, 4),
            "forecast_days": forecast_days,
            "forecast": forecast_results,
        }

    # =========================================================
    # REORDER SUGGESTION (FORECAST + SAFETY STOCK + LEAD TIME)
    # =========================================================
    async def suggest_reorder_quantity(
        self,
        db: AsyncSession,
        item_id: int,
        forecast_days: int = 7,
    ) -> Dict:

        item = await self.inventory_repo.get_item_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        current_stock = await self.inventory_repo.get_total_available_quantity(
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
                "item_id": item_id,
                "message": "Forecast unavailable",
            }

        predicted_total = sum(
            day["predicted_demand"] for day in forecast["forecast"]
        )

        # -------------------------------
        # SAFETY STOCK (10% BUFFER)
        # -------------------------------
        safety_stock = predicted_total * 0.10

        # -------------------------------
        # LEAD TIME CONSIDERATION
        # -------------------------------
        lead_time_days = item.lead_time_days or 0

        lead_time_forecast = 0
        if lead_time_days > 0:
            lead_time_forecast = (
                forecast["avg_daily_sales"] * lead_time_days
            )

        total_required = predicted_total + safety_stock + lead_time_forecast

        reorder_needed = max(0, total_required - current_stock)

        return {
            "item_id": item_id,
            "current_stock": float(current_stock),
            "predicted_demand_next_days": round(predicted_total, 2),
            "safety_stock_buffer": round(safety_stock, 2),
            "lead_time_days": lead_time_days,
            "lead_time_buffer": round(lead_time_forecast, 2),
            "recommended_reorder_quantity": round(reorder_needed, 2),
        }
