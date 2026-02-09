# backend/agents/tools.py

from typing import Dict
from uuid import UUID

from core.db import get_async_session
from services.inventory_service import InventoryService
from services.movement_service import MovementService
from services.analytics_service import AnalyticsService
from services.forecasting_service import ForecastingService
from services.notification_service import NotificationService


inventory_service = InventoryService()
movement_service = MovementService()
analytics_service = AnalyticsService()
forecasting_service = ForecastingService()
notification_service = NotificationService()


# ---------------------------------------------------
# INVENTORY
# ---------------------------------------------------

async def create_item(
    name: str,
    sku: str = None,
    unit: str = None,
    reorder_threshold: float = None,
) -> Dict:

    async with get_async_session() as db:
        return await inventory_service.create_item(
            db=db,
            name=name,
            sku=sku,
            unit=unit,
            reorder_threshold=reorder_threshold,
        )


async def add_stock(
    item_id: UUID,
    quantity: float,
    batch_number: str = None,
    expiry_date: str = None,
) -> Dict:

    async with get_async_session() as db:
        return await movement_service.add_stock(
            db=db,
            item_id=item_id,
            quantity=quantity,
            batch_number=batch_number,
            expiry_date=expiry_date,
        )


async def deduct_stock(
    item_id: UUID,
    quantity: float,
    reference_type: str,
) -> Dict:

    async with get_async_session() as db:
        return await movement_service.deduct_stock(
            db=db,
            item_id=item_id,
            quantity=quantity,
            reference_type=reference_type,
        )


async def get_total_stock(
    item_id: UUID,
) -> Dict:

    async with get_async_session() as db:
        return await inventory_service.get_total_stock(
            db=db,
            item_id=item_id,
        )


# ---------------------------------------------------
# ANALYTICS
# ---------------------------------------------------

async def get_total_sold_today() -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_total_sold_today(db)


async def get_top_selling(limit: int = 5) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_top_selling_items_today(db, limit)


async def get_least_selling(limit: int = 5) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_least_selling_items_today(db, limit)


async def get_items_expiring(days: int) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_items_expiring_within(db, days)


# ---------------------------------------------------
# FORECASTING
# ---------------------------------------------------

async def forecast_demand(
    item_id: UUID,
    forecast_days: int = 7,
) -> Dict:

    async with get_async_session() as db:
        return await forecasting_service.forecast_demand(
            db=db,
            item_id=item_id,
            forecast_days=forecast_days,
        )


async def suggest_reorder(
    item_id: UUID,
    forecast_days: int = 7,
) -> Dict:

    async with get_async_session() as db:
        return await forecasting_service.suggest_reorder_quantity(
            db=db,
            item_id=item_id,
            forecast_days=forecast_days,
        )


# ---------------------------------------------------
# NOTIFICATIONS
# ---------------------------------------------------

async def send_notification(
    subject: str,
    message: str,
    to_email: str = None,
    to_whatsapp: str = None,
) -> Dict:

    return await notification_service.send_alert(
        subject=subject,
        message=message,
        to_email=to_email,
        to_whatsapp=to_whatsapp,
    )
