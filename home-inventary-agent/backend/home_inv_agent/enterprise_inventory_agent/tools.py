# backend/agents/tools.py

from typing import Dict, List, Optional
from datetime import date

from core.db import get_async_session

from services.inventory_service import InventoryService
from services.movement_service import MovementService
from services.analytics_service import AnalyticsService
from services.forecasting_service import ForecastingService
from services.billing_service import BillingService
from services.notification_service import NotificationService
from models.schema import BillingType


inventory_service = InventoryService()
movement_service = MovementService()
analytics_service = AnalyticsService()
forecasting_service = ForecastingService()
billing_service = BillingService()
notification_service = NotificationService()


# ============================================================
# INVENTORY TOOLS
# ============================================================

async def create_item(
    name: str,
    sku: Optional[str] = None,
    category_id: Optional[int] = None,
    unit: Optional[str] = None,
    reorder_threshold: Optional[float] = None,
    lead_time_days: Optional[int] = None,
) -> Dict:

    async with get_async_session() as db:
        return await inventory_service.create_item(
            db=db,
            name=name,
            sku=sku,
            category_id=category_id,
            unit=unit,
            reorder_threshold=reorder_threshold,
            lead_time_days=lead_time_days,
        )


async def add_stock(
    item_id: int,
    quantity: float,
    room_id: int,
    batch_number: Optional[str] = None,
    expiry_date: Optional[date] = None,
    purchase_price: Optional[float] = None,
    reference_type: str = "MANUAL",
    reference_id: Optional[str] = None,
) -> Dict:

    async with get_async_session() as db:
        return await inventory_service.add_stock(
            db=db,
            item_id=item_id,
            quantity=quantity,
            room_id=room_id,
            batch_number=batch_number,
            expiry_date=expiry_date,
            purchase_price=purchase_price,
            reference_type=reference_type,
            reference_id=reference_id,
        )


async def deduct_stock(
    item_id: int,
    quantity: float,
    reference_type: str,
    reference_id: Optional[str] = None,
) -> Dict:

    async with get_async_session() as db:
        return await inventory_service.deduct_stock(
            db=db,
            item_id=item_id,
            quantity=quantity,
            reference_type=reference_type,
            reference_id=reference_id,
        )


async def get_item_stock_summary(item_id: int) -> Dict:
    async with get_async_session() as db:
        return await inventory_service.get_item_stock_summary(
            db=db,
            item_id=item_id,
        )


async def get_all_items() -> Dict:
    async with get_async_session() as db:
        return await inventory_service.get_all_items(db=db)


# ============================================================
# MOVEMENT TOOLS
# ============================================================

async def adjust_stock(
    batch_id: int,
    adjustment_quantity: float,
    reason: str,
    created_by: Optional[str] = None,
) -> Dict:

    async with get_async_session() as db:
        return await movement_service.adjust_stock(
            db=db,
            batch_id=batch_id,
            adjustment_quantity=adjustment_quantity,
            reason=reason,
            created_by=created_by,
        )


async def transfer_stock(
    batch_id: int,
    target_room_id: int,
    quantity: float,
    created_by: Optional[str] = None,
) -> Dict:

    async with get_async_session() as db:
        return await movement_service.transfer_stock(
            db=db,
            batch_id=batch_id,
            target_room_id=target_room_id,
            quantity=quantity,
            created_by=created_by,
        )


# ============================================================
# BILLING TOOLS
# ============================================================

async def create_bill(
    billing_type: BillingType,
    warehouse_id: int,
    supplier_id: Optional[int],
    customer_info: Optional[dict],
    agent_id: Optional[int],
    items: List[dict],
) -> Dict:

    async with get_async_session() as db:
        return await billing_service.create_bill(
            db=db,
            billing_type=billing_type,
            warehouse_id=warehouse_id,
            supplier_id=supplier_id,
            customer_info=customer_info,
            agent_id=agent_id,
            items=items,
        )


async def post_bill(bill_id: int) -> Dict:

    async with get_async_session() as db:
        return await billing_service.post_bill(
            db=db,
            bill_id=bill_id,
        )


# ============================================================
# ANALYTICS TOOLS
# ============================================================

async def get_total_sold_today() -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_total_sold_today(db)


async def get_total_revenue_today() -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_total_revenue_today(db)


async def get_top_selling(limit: int = 5) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_top_selling_items_today(db, limit)


async def get_least_selling(limit: int = 5) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_least_selling_items_today(db, limit)


async def get_items_expiring(days: int) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_items_expiring_within(db, days)


async def get_total_stock_per_item() -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_total_stock_per_item(db)


async def get_dead_stock(days: int = 30) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_dead_stock(db, days)


async def get_stock_turnover(item_id: int, days: int = 30) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_stock_turnover(
            db=db,
            item_id=item_id,
            days=days,
        )


async def get_daily_sales_history(item_id: int, days: int = 30) -> Dict:
    async with get_async_session() as db:
        return await analytics_service.get_daily_sales_history(
            db=db,
            item_id=item_id,
            days=days,
        )


# ============================================================
# FORECASTING TOOLS
# ============================================================

async def forecast_demand(
    item_id: int,
    history_days: int = 30,
    forecast_days: int = 7,
) -> Dict:

    async with get_async_session() as db:
        return await forecasting_service.forecast_demand(
            db=db,
            item_id=item_id,
            history_days=history_days,
            forecast_days=forecast_days,
        )


async def suggest_reorder(
    item_id: int,
    forecast_days: int = 7,
) -> Dict:

    async with get_async_session() as db:
        return await forecasting_service.suggest_reorder_quantity(
            db=db,
            item_id=item_id,
            forecast_days=forecast_days,
        )


# ============================================================
# NOTIFICATION TOOLS
# ============================================================

async def send_notification(
    subject: str,
    message: str,
    to_email: Optional[str] = None,
    to_whatsapp: Optional[str] = None,
) -> Dict:

    return await notification_service.send_alert(
        subject=subject,
        message=message,
        to_email=to_email,
        to_whatsapp=to_whatsapp,
    )
