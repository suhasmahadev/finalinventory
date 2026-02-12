from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update
from sqlalchemy.orm import selectinload

from models.schema import Warehouse, Room, InventoryBatch


class WarehouseRepo:

    # ----------------------------------------------------
    # CREATE WAREHOUSE
    # ----------------------------------------------------
    async def create_warehouse(
        self,
        db: AsyncSession,
        name: str,
        address: str | None
    ):

        warehouse = Warehouse(name=name, address=address)
        db.add(warehouse)
        await db.flush()
        return warehouse

    # ----------------------------------------------------
    # CREATE ROOM
    # ----------------------------------------------------
    async def create_room(
        self,
        db: AsyncSession,
        warehouse_id: int,
        name: str,
        floor_no: int | None
    ):

        room = Room(
            warehouse_id=warehouse_id,
            name=name,
            floor_no=floor_no
        )

        db.add(room)
        await db.flush()
        return room

    # ----------------------------------------------------
    # UPDATE ROOM
    # ----------------------------------------------------
    async def update_room(
        self,
        db: AsyncSession,
        room_id: int,
        name: str | None = None,
        floor_no: int | None = None
    ):

        values = {}

        if name is not None:
            values["name"] = name

        if floor_no is not None:
            values["floor_no"] = floor_no

        if not values:
            return

        stmt = (
            update(Room)
            .where(Room.id == room_id)
            .values(**values)
        )

        await db.execute(stmt)

    # ----------------------------------------------------
    # DELETE ROOM
    # ----------------------------------------------------
    async def delete_room(
        self,
        db: AsyncSession,
        room_id: int
    ):

        stmt = delete(Room).where(Room.id == room_id)
        await db.execute(stmt)

    # ----------------------------------------------------
    # GET ROOM BY ID
    # ----------------------------------------------------
    async def get_room_by_id(
        self,
        db: AsyncSession,
        room_id: int
    ):

        stmt = select(Room).where(Room.id == room_id)
        result = await db.execute(stmt)
        return result.scalars().first()

    # ----------------------------------------------------
    # GET ROOM WITH STOCK BATCHES
    # ----------------------------------------------------
    async def get_room_with_batches(
        self,
        db: AsyncSession,
        room_id: int
    ):

        stmt = (
            select(Room)
            .where(Room.id == room_id)
            .options(selectinload(Room.warehouse))
        )

        result = await db.execute(stmt)
        return result.scalars().first()

    # ----------------------------------------------------
    # GET ALL WAREHOUSES
    # ----------------------------------------------------
    async def list_warehouses(
        self,
        db: AsyncSession
    ):

        stmt = select(Warehouse)
        result = await db.execute(stmt)
        return result.scalars().all()

    # ----------------------------------------------------
    # GET WAREHOUSE WITH ROOMS
    # ----------------------------------------------------
    async def get_warehouse_with_rooms(
        self,
        db: AsyncSession,
        warehouse_id: int
    ):

        stmt = (
            select(Warehouse)
            .where(Warehouse.id == warehouse_id)
            .options(selectinload(Warehouse.rooms))
        )

        result = await db.execute(stmt)
        return result.scalars().first()

    # ----------------------------------------------------
    # GET ROOM STOCK AGGREGATE
    # ----------------------------------------------------
    async def get_room_stock_summary(
        self,
        db: AsyncSession,
        room_id: int
    ):

        stmt = (
            select(func.coalesce(func.sum(InventoryBatch.quantity_available), 0))
            .where(InventoryBatch.room_id == room_id)
        )

        result = await db.execute(stmt)
        return float(result.scalar() or 0)

    # ----------------------------------------------------
    # GET WAREHOUSE TOTAL STOCK
    # ----------------------------------------------------
    async def get_warehouse_total_stock(
        self,
        db: AsyncSession,
        warehouse_id: int
    ):

        stmt = (
            select(func.coalesce(func.sum(InventoryBatch.quantity_available), 0))
            .join(Room, InventoryBatch.room_id == Room.id)
            .where(Room.warehouse_id == warehouse_id)
        )

        result = await db.execute(stmt)
        return float(result.scalar() or 0)

    # ----------------------------------------------------
    # GET ALL ROOMS BY WAREHOUSE
    # ----------------------------------------------------
    async def get_rooms_by_warehouse(
        self,
        db: AsyncSession,
        warehouse_id: int
    ):

        stmt = select(Room).where(Room.warehouse_id == warehouse_id)
        result = await db.execute(stmt)
        return result.scalars().all()
