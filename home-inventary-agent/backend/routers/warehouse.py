# backend/routers/warehouse.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional

from dependencies import get_db
from services.warehouse_service import WarehouseService

router = APIRouter(prefix="/warehouse", tags=["Warehouse"])

warehouse_service = WarehouseService()


# =========================================================
# REQUEST MODELS
# =========================================================

class WarehouseCreate(BaseModel):
    name: str
    address: Optional[str] = None


class RoomCreate(BaseModel):
    warehouse_id: int
    name: str
    floor_no: Optional[int] = None


# =========================================================
# CREATE WAREHOUSE
# =========================================================
@router.post("/")
async def create_warehouse(
    payload: WarehouseCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.create_warehouse(
            db=db,
            name=payload.name,
            address=payload.address,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# DELETE WAREHOUSE (SAFE)
# =========================================================
@router.delete("/{warehouse_id}")
async def delete_warehouse(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.delete_warehouse(
            db=db,
            warehouse_id=warehouse_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# GET SINGLE WAREHOUSE
# =========================================================
@router.get("/{warehouse_id}")
async def get_warehouse(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.get_warehouse_dashboard(
            db=db,
            warehouse_id=warehouse_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# =========================================================
# LIST ALL WAREHOUSES
# =========================================================
@router.get("/list")
async def list_warehouses(
    db: AsyncSession = Depends(get_db),
):
    return await warehouse_service.list_warehouses(db)


# =========================================================
# CREATE ROOM
# =========================================================
@router.post("/room")
async def create_room(
    payload: RoomCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.create_room(
            db=db,
            warehouse_id=payload.warehouse_id,
            name=payload.name,
            floor_no=payload.floor_no,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# =========================================================
# DELETE ROOM (SAFE DELETE)
# =========================================================
@router.delete("/room/{room_id}")
async def delete_room(
    room_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.delete_room(
            db=db,
            room_id=room_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# GET ROOM DETAILS
# =========================================================
@router.get("/room/{room_id}")
async def get_room(
    room_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.get_room_details(
            db=db,
            room_id=room_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# =========================================================
# WAREHOUSE DASHBOARD (DETAILED VIEW)
# =========================================================
@router.get("/dashboard/{warehouse_id}")
async def get_warehouse_dashboard(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await warehouse_service.get_warehouse_dashboard(
            db=db,
            warehouse_id=warehouse_id,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
