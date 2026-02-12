from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Optional

from repos.warehouse_repo import WarehouseRepo


class WarehouseService:

    def __init__(self):
        self.repo = WarehouseRepo()

    # ----------------------------------------------------
    # CREATE WAREHOUSE
    # ----------------------------------------------------
    async def create_warehouse(
        self,
        db: AsyncSession,
        name: str,
        address: Optional[str]
    ):
        warehouse = await self.repo.create_warehouse(db, name, address)

        await db.commit()
        await db.refresh(warehouse)

        return {
            "id": warehouse.id,
            "name": warehouse.name,
            "address": warehouse.address
        }

    # ----------------------------------------------------
    # DELETE WAREHOUSE (SAFE)
    # ----------------------------------------------------
    async def delete_warehouse(
        self,
        db: AsyncSession,
        warehouse_id: int
    ):
        warehouse = await self.repo.get_warehouse_with_rooms(db, warehouse_id)
        if not warehouse:
            raise ValueError("Warehouse not found")

        if warehouse.rooms:
            raise ValueError("Cannot delete warehouse with existing rooms")

        await self.repo.delete_warehouse(db, warehouse_id)
        await db.commit()

        return {"status": "deleted"}

    # ----------------------------------------------------
    # CREATE ROOM
    # ----------------------------------------------------
    async def create_room(
        self,
        db: AsyncSession,
        warehouse_id: int,
        name: str,
        floor_no: Optional[int]
    ):
        warehouse = await self.repo.get_warehouse_with_rooms(db, warehouse_id)
        if not warehouse:
            raise ValueError("Warehouse not found")

        room = await self.repo.create_room(db, warehouse_id, name, floor_no)

        await db.commit()
        await db.refresh(room)

        return {
            "id": room.id,
            "warehouse_id": room.warehouse_id,
            "name": room.name,
            "floor_no": room.floor_no
        }

    # ----------------------------------------------------
    # UPDATE ROOM
    # ----------------------------------------------------
    async def update_room(
        self,
        db: AsyncSession,
        room_id: int,
        name: Optional[str] = None,
        floor_no: Optional[int] = None
    ):
        room = await self.repo.get_room_by_id(db, room_id)
        if not room:
            raise ValueError("Room not found")

        await self.repo.update_room(
            db=db,
            room_id=room_id,
            name=name,
            floor_no=floor_no
        )

        await db.commit()

        return {"status": "updated"}

    # ----------------------------------------------------
    # DELETE ROOM (SAFE)
    # ----------------------------------------------------
    async def delete_room(
        self,
        db: AsyncSession,
        room_id: int
    ):
        room = await self.repo.get_room_by_id(db, room_id)
        if not room:
            raise ValueError("Room not found")

        stock = await self.repo.get_room_stock_summary(db, room_id)
        if stock > 0:
            raise ValueError("Cannot delete room with existing stock")

        await self.repo.delete_room(db, room_id)
        await db.commit()

        return {"status": "deleted"}

    # ----------------------------------------------------
    # GET SINGLE WAREHOUSE
    # ----------------------------------------------------
    async def get_warehouse(
        self,
        db: AsyncSession,
        warehouse_id: int
    ):
        warehouse = await self.repo.get_warehouse_with_rooms(db, warehouse_id)
        if not warehouse:
            raise ValueError("Warehouse not found")

        return {
            "id": warehouse.id,
            "name": warehouse.name,
            "address": warehouse.address,
            "total_rooms": len(warehouse.rooms)
        }

    # ----------------------------------------------------
    # GET ROOM DETAILS
    # ----------------------------------------------------
    async def get_room_details(
        self,
        db: AsyncSession,
        room_id: int
    ):
        room = await self.repo.get_room_by_id(db, room_id)
        if not room:
            raise ValueError("Room not found")

        stock = await self.repo.get_room_stock_summary(db, room_id)

        return {
            "id": room.id,
            "warehouse_id": room.warehouse_id,
            "name": room.name,
            "floor_no": room.floor_no,
            "total_stock": float(stock)
        }

    # ----------------------------------------------------
    # GET ROOMS BY WAREHOUSE
    # ----------------------------------------------------
    async def get_rooms_by_warehouse(
        self,
        db: AsyncSession,
        warehouse_id: int
    ):
        rooms = await self.repo.get_rooms_by_warehouse(db, warehouse_id)

        return {
            "count": len(rooms),
            "data": [
                {
                    "id": r.id,
                    "warehouse_id": r.warehouse_id,
                    "name": r.name,
                    "floor_no": r.floor_no
                }
                for r in rooms
            ]
        }

    # ----------------------------------------------------
    # LIST WAREHOUSES
    # ----------------------------------------------------
    async def list_warehouses(self, db: AsyncSession):
        warehouses = await self.repo.list_warehouses(db)

        return {
            "count": len(warehouses),
            "data": [
                {
                    "id": w.id,
                    "name": w.name,
                    "address": w.address
                }
                for w in warehouses
            ]
        }

    # ----------------------------------------------------
    # WAREHOUSE DASHBOARD
    # ----------------------------------------------------
    async def get_warehouse_dashboard(
        self,
        db: AsyncSession,
        warehouse_id: int
    ) -> Dict:

        warehouse = await self.repo.get_warehouse_with_rooms(db, warehouse_id)
        if not warehouse:
            raise ValueError("Warehouse not found")

        total_stock = await self.repo.get_warehouse_total_stock(db, warehouse_id)

        room_data = []

        for room in warehouse.rooms:
            room_stock = await self.repo.get_room_stock_summary(db, room.id)

            room_data.append({
                "room_id": room.id,
                "room_name": room.name,
                "floor_no": room.floor_no,
                "total_stock": float(room_stock)
            })

        return {
            "warehouse_id": warehouse.id,
            "warehouse_name": warehouse.name,
            "address": warehouse.address,
            "total_rooms": len(warehouse.rooms),
            "total_stock": float(total_stock),
            "rooms": room_data
        }
