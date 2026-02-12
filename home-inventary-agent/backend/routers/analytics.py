# backend/routers/analytics.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies import get_db
from services.analytics_service import AnalyticsService
from services.forecasting_service import ForecastingService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

analytics_service = AnalyticsService()
forecasting_service = ForecastingService()


# =========================================================
# TOTAL SOLD TODAY
# =========================================================
@router.get("/sold-today")
async def get_total_sold_today(
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_total_sold_today(db)


# =========================================================
# TOTAL REVENUE TODAY
# =========================================================
@router.get("/revenue-today")
async def get_total_revenue_today(
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_total_revenue_today(db)


# =========================================================
# TOP SELLING ITEMS
# =========================================================
@router.get("/top-selling")
async def get_top_selling(
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
):
    if limit <= 0:
        raise HTTPException(status_code=400, detail="Limit must be positive")

    return await analytics_service.get_top_selling_items_today(
        db=db,
        limit=limit,
    )


# =========================================================
# LEAST SELLING ITEMS
# =========================================================
@router.get("/least-selling")
async def get_least_selling(
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
):
    if limit <= 0:
        raise HTTPException(status_code=400, detail="Limit must be positive")

    return await analytics_service.get_least_selling_items_today(
        db=db,
        limit=limit,
    )


# =========================================================
# EXPIRING ITEMS
# =========================================================
@router.get("/expiring")
async def get_expiring(
    days: int,
    db: AsyncSession = Depends(get_db),
):
    if days <= 0:
        raise HTTPException(status_code=400, detail="Days must be positive")

    return await analytics_service.get_items_expiring_within(
        db=db,
        days=days,
    )


# =========================================================
# TOTAL STOCK PER ITEM
# =========================================================
@router.get("/stock-summary")
async def get_total_stock_per_item(
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_total_stock_per_item(db)


# =========================================================
# DEAD STOCK
# =========================================================
@router.get("/dead-stock")
async def get_dead_stock(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
):
    if days <= 0:
        raise HTTPException(status_code=400, detail="Days must be positive")

    return await analytics_service.get_dead_stock(
        db=db,
        days=days,
    )


# =========================================================
# STOCK TURNOVER RATIO
# =========================================================
@router.get("/turnover/{item_id}")
async def get_stock_turnover(
    item_id: int,
    days: int = 30,
    db: AsyncSession = Depends(get_db),
):
    if days <= 0:
        raise HTTPException(status_code=400, detail="Days must be positive")

    return await analytics_service.get_stock_turnover(
        db=db,
        item_id=item_id,
        days=days,
    )


# =========================================================
# DAILY SALES HISTORY (ML READY)
# =========================================================
@router.get("/history/{item_id}")
async def get_sales_history(
    item_id: int,
    days: int = 30,
    db: AsyncSession = Depends(get_db),
):
    if days <= 0:
        raise HTTPException(status_code=400, detail="Days must be positive")

    return await analytics_service.get_daily_sales_history(
        db=db,
        item_id=item_id,
        days=days,
    )


# =========================================================
# FORECAST DEMAND
# =========================================================
@router.get("/forecast/{item_id}")
async def forecast_item(
    item_id: int,
    days: int = 7,
    db: AsyncSession = Depends(get_db),
):
    if days <= 0:
        raise HTTPException(status_code=400, detail="Forecast days must be positive")

    return await forecasting_service.forecast_demand(
        db=db,
        item_id=item_id,
        forecast_days=days,
    )


# =========================================================
# REORDER SUGGESTION
# =========================================================
@router.get("/reorder/{item_id}")
async def suggest_reorder(
    item_id: int,
    days: int = 7,
    db: AsyncSession = Depends(get_db),
):
    if days <= 0:
        raise HTTPException(status_code=400, detail="Forecast days must be positive")

    return await forecasting_service.suggest_reorder_quantity(
        db=db,
        item_id=item_id,
        forecast_days=days,
    )
