# routers/analytics.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from dependencies import get_db
from services.analytics_service import AnalyticsService
from services.forecasting_service import ForecastingService


router = APIRouter(prefix="/analytics", tags=["Analytics"])

analytics_service = AnalyticsService()
forecasting_service = ForecastingService()


@router.get("/sold-today")
async def get_total_sold_today(
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_total_sold_today(db)


@router.get("/top-selling")
async def get_top_selling(
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_top_selling_items_today(db, limit)


@router.get("/least-selling")
async def get_least_selling(
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_least_selling_items_today(db, limit)


@router.get("/expiring")
async def get_expiring(
    days: int,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_service.get_items_expiring_within(db, days)


@router.get("/forecast/{item_id}")
async def forecast_item(
    item_id: UUID,
    days: int = 7,
    db: AsyncSession = Depends(get_db),
):
    return await forecasting_service.forecast_demand(
        db=db,
        item_id=item_id,
        forecast_days=days,
    )
