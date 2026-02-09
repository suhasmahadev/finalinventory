# routers/inventory.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Optional

from dependencies import get_db
from services.inventory_service import InventoryService
from datetime import date

router = APIRouter(prefix="/inventory", tags=["Inventory"])

inventory_service = InventoryService()


# ---------------------------------------------------
# CREATE ITEM
# ---------------------------------------------------
@router.post("/item")
async def create_item(
    name: str,
    sku: Optional[str] = None,
    category_id: Optional[UUID] = None,
    unit: Optional[str] = None,
    reorder_threshold: Optional[float] = None,
    lead_time_days: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    return await inventory_service.create_item(
        db=db,
        name=name,
        sku=sku,
        category_id=category_id,
        unit=unit,
        reorder_threshold=reorder_threshold,
        lead_time_days=lead_time_days,
    )


# ---------------------------------------------------
# ADD STOCK
# ---------------------------------------------------
@router.post("/stock/add")
async def add_stock(
    item_id: UUID,
    quantity: float,
    room_id: Optional[UUID] = None,
    warehouse_id: Optional[UUID] = None,
    batch_number: Optional[str] = None,
    expiry_date: Optional[date] = None,
    purchase_price: Optional[float] = None,
    created_by: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await inventory_service.add_stock(
        db=db,
        item_id=item_id,
        quantity=quantity,
        room_id=room_id,
        warehouse_id=warehouse_id,
        batch_number=batch_number,
        expiry_date=expiry_date,
        purchase_price=purchase_price,
        created_by=created_by,
    )


# ---------------------------------------------------
# DEDUCT STOCK
# ---------------------------------------------------
@router.post("/stock/deduct")
async def deduct_stock(
    item_id: UUID,
    quantity: float,
    reference_type: str,
    reference_id: Optional[str] = None,
    created_by: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await inventory_service.deduct_stock(
        db=db,
        item_id=item_id,
        quantity=quantity,
        reference_type=reference_type,
        reference_id=reference_id,
        created_by=created_by,
    )


# ---------------------------------------------------
# GET STOCK SUMMARY
# ---------------------------------------------------
@router.get("/stock/{item_id}")
async def get_total_stock(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await inventory_service.get_item_stock_summary(
        db=db,
        item_id=item_id,
    )

# ---------------------------------------------------
# GET ALL ITEMS
# ---------------------------------------------------
@router.get("/items")
async def get_all_items(
    db: AsyncSession = Depends(get_db),
):
    return await inventory_service.get_all_items(db)
