# backend/routers/warehouse.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from pydantic import BaseModel

from dependencies import get_db
from models.schema import Warehouse, Room

router = APIRouter(prefix="/warehouse", tags=["Warehouse"])


# ----------------------------
# Request Models
# ----------------------------

class WarehouseCreate(BaseModel):
    name: str
    address: str | None = None


class RoomCreate(BaseModel):
    warehouse_id: UUID
    name: str
    floor_no: int | None = None


# ----------------------------
# Create Warehouse
# ----------------------------

@router.post("/")
async def create_warehouse(
    payload: WarehouseCreate,
    db: AsyncSession = Depends(get_db)
):
    warehouse = Warehouse(
        name=payload.name,
        address=payload.address
    )

    db.add(warehouse)
    await db.commit()
    await db.refresh(warehouse)

    return {
        "id": warehouse.id,
        "name": warehouse.name,
        "address": warehouse.address
    }


# ----------------------------
# Create Room
# ----------------------------

@router.post("/room")
async def create_room(
    payload: RoomCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check warehouse exists
    warehouse = await db.get(Warehouse, payload.warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    room = Room(
        warehouse_id=payload.warehouse_id,
        name=payload.name,
        floor_no=payload.floor_no
    )

    db.add(room)
    await db.commit()
    await db.refresh(room)

    return {
        "id": room.id,
        "warehouse_id": room.warehouse_id,
        "name": room.name,
        "floor_no": room.floor_no
    }

# ----------------------------
# List Warehouses
# ----------------------------

@router.get("/list")
async def list_warehouses(
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    result = await db.execute(select(Warehouse))
    warehouses = result.scalars().all()
    
    return {
        "count": len(warehouses),
        "data": [
            {
                "id": w.id,
                "name": w.name,
                "address": w.address
            } for w in warehouses
        ]
    }
