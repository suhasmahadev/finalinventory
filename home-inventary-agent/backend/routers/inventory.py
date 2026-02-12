# backend/routers/inventory.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import date

from dependencies import get_db
from services.inventory_service import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])

inventory_service = InventoryService()


# =========================================================
# CREATE ITEM
# =========================================================
@router.post("/item")
async def create_item(
    name: str,
    sku: Optional[str] = None,
    category_id: Optional[int] = None,
    unit: Optional[str] = None,
    reorder_threshold: Optional[float] = None,
    lead_time_days: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await inventory_service.create_item(
            db=db,
            name=name,
            sku=sku,
            category_id=category_id,
            unit=unit,
            reorder_threshold=reorder_threshold,
            lead_time_days=lead_time_days,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# ADD STOCK
# =========================================================
@router.post("/stock/add")
async def add_stock(
    item_id: int,
    quantity: float,
    room_id: int,
    batch_number: Optional[str] = None,
    expiry_date: Optional[date] = None,
    purchase_price: Optional[float] = None,
    reference_type: str = "MANUAL",
    reference_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Adds stock to a specific room.
    Room is mandatory (as per final service design).
    """

    try:
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
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# DEDUCT STOCK (FIFO SAFE)
# =========================================================
@router.post("/stock/deduct")
async def deduct_stock(
    item_id: int,
    quantity: float,
    reference_type: str,
    reference_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Deducts stock using FIFO logic handled by service.
    """

    try:
        return await inventory_service.deduct_stock(
            db=db,
            item_id=item_id,
            quantity=quantity,
            reference_type=reference_type,
            reference_id=reference_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# GET STOCK SUMMARY FOR ITEM
# =========================================================
@router.get("/stock/{item_id}")
async def get_item_stock_summary(
    item_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await inventory_service.get_item_stock_summary(
            db=db,
            item_id=item_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# =========================================================
# LIST ALL ITEMS
# =========================================================
@router.get("/items")
async def get_all_items(
    db: AsyncSession = Depends(get_db),
):
    return await inventory_service.get_all_items(db)
