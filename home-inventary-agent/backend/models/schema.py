# backend/models/schema.py
import uuid
from sqlalchemy import (
    Column, String, Integer, ForeignKey, Date, DateTime, Text, Enum,
    Numeric, Boolean, func, Index, text
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, TIMESTAMP
from sqlalchemy.orm import relationship
from core.db import Base
from enum import Enum as PyEnum


def gen_uuid():
    return str(uuid.uuid4())


class MovementType(PyEnum):
    IN = "IN"
    OUT = "OUT"
    ADJUSTMENT = "ADJUSTMENT"
    TRANSFER = "TRANSFER"


# Warehouses (multi-warehouse support)
# Warehouses (multi-warehouse support)
class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    address = Column(Text, nullable=True)

    # ✅ FIX: attribute renamed, DB column name preserved
    metadata_ = Column("metadata", JSONB, nullable=True, server_default=text("'{}'::jsonb"))

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


# Rooms inside a warehouse (shelves/zones)
class Room(Base):
    __tablename__ = "rooms"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    floor_no = Column(Integer, nullable=True)
    meta = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    warehouse = relationship("Warehouse", backref="rooms")


# Categories
class Category(Base):
    __tablename__ = "categories"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


# Master catalog of items (no qty)
class Item(Base):
    __tablename__ = "items"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(512), nullable=False)
    sku = Column(String(128), nullable=True, unique=True)
    category_id = Column(PG_UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    unit = Column(String(32), nullable=True)  # piece/kg/litre etc.
    reorder_threshold = Column(Numeric, nullable=True)
    lead_time_days = Column(Integer, nullable=True)
    meta = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    category = relationship("Category", backref="items")


# Suppliers
class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(512), nullable=False)
    contact = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    payment_terms = Column(String(128), nullable=True)
    meta = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


# Purchase orders + lines (for receiving stock)
class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    po_number = Column(String(128), nullable=True, unique=True)
    supplier_id = Column(PG_UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(64), nullable=False, default="OPEN")
    expected_delivery = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    supplier = relationship("Supplier", backref="purchase_orders")


class POLine(Base):
    __tablename__ = "po_lines"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    po_id = Column(PG_UUID(as_uuid=True), ForeignKey("purchase_orders.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(PG_UUID(as_uuid=True), ForeignKey("items.id", ondelete="SET NULL"), nullable=True)
    qty_ordered = Column(Numeric, nullable=False)
    qty_received = Column(Numeric, nullable=True, default=0)
    unit_price = Column(Numeric, nullable=True)
    batch_number_suggested = Column(String(255), nullable=True)

    po = relationship("PurchaseOrder", backref="lines")
    item = relationship("Item")


# Inventory batches (the true stock)
class InventoryBatch(Base):
    __tablename__ = "inventory_batches"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(PG_UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    room_id = Column(PG_UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True)
    batch_number = Column(String(255), nullable=True)
    quantity_total = Column(Numeric, nullable=False, default=0)
    quantity_available = Column(Numeric, nullable=False, default=0)
    expiry_date = Column(Date, nullable=True)
    purchase_price = Column(Numeric, nullable=True)
    received_at = Column(TIMESTAMP(timezone=True), nullable=True)
    meta = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    item = relationship("Item", backref="batches")
    room = relationship("Room")
    warehouse = relationship("Warehouse")


# Immutable ledger of stock movements
class StockMovement(Base):
    __tablename__ = "stock_movements"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(PG_UUID(as_uuid=True), ForeignKey("inventory_batches.id", ondelete="SET NULL"), nullable=True)
    item_id = Column(PG_UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True)
    room_id = Column(PG_UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    movement_type = Column(Enum(MovementType, name="movement_type"), nullable=False)
    quantity = Column(Numeric, nullable=False)
    reference_type = Column(String(64), nullable=True)
    reference_id = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)  # user id or 'agent'/'iot'
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    tx_id = Column(PG_UUID(as_uuid=True), nullable=True)  # group id for multi-row transactions

    batch = relationship("InventoryBatch")
    item = relationship("Item")


# IoT devices & device events
class IoTDevice(Base):
    __tablename__ = "iot_devices"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_type = Column(String(128), nullable=False)  # RFID, SCALE, GATEWAY
    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True)
    room_id = Column(PG_UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    meta = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    last_seen = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


class DeviceEvent(Base):
    __tablename__ = "device_events"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(PG_UUID(as_uuid=True), ForeignKey("iot_devices.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(128), nullable=False)
    payload = Column(JSONB, nullable=True, server_default=text("'{}'::jsonb"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    device = relationship("IoTDevice")


# Users, roles, audit logs
class Role(Base):
    __tablename__ = "roles"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(128), nullable=False, unique=True)
    permissions = Column(JSONB, nullable=True)


class User(Base):
    __tablename__ = "users"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(128), nullable=False, unique=True)
    role_id = Column(PG_UUID(as_uuid=True), ForeignKey("roles.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    role = relationship("Role")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)
    target_table = Column(String(255), nullable=True)
    target_id = Column(String(255), nullable=True)
    diff = Column(JSONB, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


# Sales (POS) documents — for future billing integration
class SalesDocument(Base):
    __tablename__ = "sales_documents"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_bill_id = Column(String(255), nullable=True, unique=True)
    customer = Column(JSONB, nullable=True)
    status = Column(String(64), nullable=False, default="OPEN")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


class SalesLine(Base):
    __tablename__ = "sales_lines"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sale_id = Column(PG_UUID(as_uuid=True), ForeignKey("sales_documents.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(PG_UUID(as_uuid=True), ForeignKey("items.id", ondelete="SET NULL"), nullable=True)
    qty = Column(Numeric, nullable=False)
    unit_price = Column(Numeric, nullable=True)
    batch_preferred = Column(String(255), nullable=True)


# Time-series aggregated sales for ML
class TimeSeriesSales(Base):
    __tablename__ = "time_series_sales"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(PG_UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True)
    date = Column(Date, nullable=False)
    qty_sold = Column(Numeric, nullable=False)
    meta = Column(JSONB, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_time_series_item_date", "item_id", "date"),
    )


# Alerts / notifications
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(64), nullable=False)  # REORDER, EXPIRY_SOON, DEVICE_OFFLINE
    payload = Column(JSONB, nullable=True)
    status = Column(String(32), nullable=False, default="OPEN")  # OPEN / RESOLVED
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    resolved_at = Column(TIMESTAMP(timezone=True), nullable=True)
