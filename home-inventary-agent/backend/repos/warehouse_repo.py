# backend/repos/warehouse_repo.py

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.schema import Warehouse, Room
from uuid import UUID
from typing import Optional, List


class WarehouseRepo:

    # -----------------------------
    # Warehouse
    # -----------------------------
    async def create_warehouse(
        self,
        db: AsyncSession,
        name: str,
        address: Optional[str] = None,
    ) -> Warehouse:

        warehouse = Warehouse(
            name=name,
            address=address
        )

        db.add(warehouse)
        await db.flush()
        return warehouse

    async def get_warehouse_by_id(
        self,
        db: AsyncSession,
        warehouse_id: UUID
    ) -> Optional[Warehouse]:

        result = await db.execute(
            select(Warehouse).where(Warehouse.id == warehouse_id)
        )

        return result.scalar_one_or_none()

    async def list_warehouses(
        self,
        db: AsyncSession
    ) -> List[Warehouse]:

        result = await db.execute(select(Warehouse))
        return result.scalars().all()

    # -----------------------------
    # Rooms
    # -----------------------------
    async def create_room(
        self,
        db: AsyncSession,
        warehouse_id: UUID,
        name: str,
        floor_no: Optional[int] = None,
    ) -> Room:

        room = Room(
            warehouse_id=warehouse_id,
            name=name,
            floor_no=floor_no,
        )

        db.add(room)
        await db.flush()
        return room

    async def list_rooms_by_warehouse(
        self,
        db: AsyncSession,
        warehouse_id: UUID
    ) -> List[Room]:

        result = await db.execute(
            select(Room).where(Room.warehouse_id == warehouse_id)
        )

        return result.scalars().all()

    async def get_room_by_id(
        self,
        db: AsyncSession,
        room_id: UUID
    ) -> Optional[Room]:

        result = await db.execute(
            select(Room).where(Room.id == room_id)
        )

        return result.scalar_one_or_none()
