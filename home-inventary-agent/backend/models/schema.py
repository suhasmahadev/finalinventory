# backend/models/schema.py
from sqlalchemy import (
    Column, String, Integer, ForeignKey, Date, DateTime, Text, Enum,
    Numeric, Boolean, func, Index, text
)
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from sqlalchemy.orm import relationship
from core.db import Base
from enum import Enum as PyEnum


# =========================================================
# ENUMS
# =========================================================

class MovementType(PyEnum):
    IN = "IN"
    OUT = "OUT"
    ADJUSTMENT = "ADJUSTMENT"
    TRANSFER = "TRANSFER"


class BillingType(PyEnum):
    INCOMING = "INCOMING"
    OUTGOING = "OUTGOING"


class RoomType(PyEnum):
    NORMAL = "NORMAL"
    COLD_STORAGE = "COLD_STORAGE"
    PACKING = "PACKING"
    OTHER = "OTHER"


class BatchStatus(PyEnum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    DAMAGED = "DAMAGED"
    RESERVED = "RESERVED"


class PaymentStatus(PyEnum):
    PENDING = "PENDING"
    PAID = "PAID"
    OVERDUE = "OVERDUE"


# =========================================================
# WAREHOUSES
# =========================================================

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    address = Column(Text, nullable=True)

    # EXISTING
    metadata_ = Column("metadata", JSONB, nullable=True,
                       server_default=text("'{}'::jsonb"))

    # NEW ADDITIONS (SAFE)
    capacity = Column(Numeric, nullable=True)
    is_active = Column(Boolean, default=True)
    latitude = Column(Numeric, nullable=True)
    longitude = Column(Numeric, nullable=True)

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), nullable=False)

    rooms = relationship("Room", backref="warehouse")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer,
                          ForeignKey("warehouses.id", ondelete="CASCADE"),
                          nullable=False)

    name = Column(String(255), nullable=False)
    floor_no = Column(Integer, nullable=True)

    # EXISTING
    meta = Column(JSONB, nullable=True,
                  server_default=text("'{}'::jsonb"))

    # NEW ADDITIONS
    capacity = Column(Numeric, nullable=True)
    priority = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    room_type = Column(Enum(RoomType, name="room_type"),
                       default=RoomType.NORMAL)
    temperature_min = Column(Numeric, nullable=True)
    temperature_max = Column(Numeric, nullable=True)

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), nullable=False)


# =========================================================
# CATEGORIES
# =========================================================

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), nullable=False)


# =========================================================
# ITEMS
# =========================================================

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(512), nullable=False)
    sku = Column(String(128), nullable=True, unique=True, index=True)
    category_id = Column(Integer,
                         ForeignKey("categories.id",
                                    ondelete="SET NULL"),
                         nullable=True)
    unit = Column(String(32), nullable=True)
    reorder_threshold = Column(Numeric, nullable=True)
    lead_time_days = Column(Integer, nullable=True)

    meta = Column(JSONB, nullable=True,
                  server_default=text("'{}'::jsonb"))

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), nullable=False)

    category = relationship("Category", backref="items")
    batches = relationship("InventoryBatch", backref="item")


# =========================================================
# SUPPLIERS
# =========================================================

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(512), nullable=False)
    contact = Column(JSONB, nullable=True,
                     server_default=text("'{}'::jsonb"))
    payment_terms = Column(String(128), nullable=True)
    meta = Column(JSONB, nullable=True,
                  server_default=text("'{}'::jsonb"))

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), nullable=False)


# =========================================================
# PURCHASE ORDERS
# =========================================================

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(128), nullable=True, unique=True)
    supplier_id = Column(Integer,
                         ForeignKey("suppliers.id",
                                    ondelete="SET NULL"),
                         nullable=True)
    status = Column(String(64), nullable=False, default="OPEN")
    expected_delivery = Column(TIMESTAMP(timezone=True),
                               nullable=True)

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), nullable=False)

    supplier = relationship("Supplier", backref="purchase_orders")


class POLine(Base):
    __tablename__ = "po_lines"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer,
                   ForeignKey("purchase_orders.id",
                              ondelete="CASCADE"),
                   nullable=False)
    item_id = Column(Integer,
                     ForeignKey("items.id",
                                ondelete="SET NULL"),
                     nullable=True)
    qty_ordered = Column(Numeric, nullable=False)
    qty_received = Column(Numeric, nullable=True, default=0)
    unit_price = Column(Numeric, nullable=True)
    batch_number_suggested = Column(String(255),
                                    nullable=True)

    po = relationship("PurchaseOrder", backref="lines")
    item = relationship("Item")


# =========================================================
# INVENTORY
# =========================================================

class InventoryBatch(Base):
    __tablename__ = "inventory_batches"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer,
                     ForeignKey("items.id",
                                ondelete="CASCADE"),
                     nullable=False)
    room_id = Column(Integer,
                     ForeignKey("rooms.id",
                                ondelete="SET NULL"),
                     nullable=True)
    warehouse_id = Column(Integer,
                          ForeignKey("warehouses.id",
                                     ondelete="SET NULL"),
                          nullable=True)

    batch_number = Column(String(255), nullable=True)

    quantity_total = Column(Numeric, nullable=False,
                            default=0)
    quantity_available = Column(Numeric, nullable=False,
                                default=0)

    # NEW SAFE UPGRADES
    reserved_quantity = Column(Numeric, default=0)
    status = Column(Enum(BatchStatus,
                         name="batch_status"),
                    default=BatchStatus.ACTIVE)
    locked = Column(Boolean, default=False)
    last_movement_at = Column(TIMESTAMP(timezone=True),
                              nullable=True)

    expiry_date = Column(Date, nullable=True)
    purchase_price = Column(Numeric, nullable=True)
    received_at = Column(TIMESTAMP(timezone=True),
                         nullable=True)

    meta = Column(JSONB, nullable=True,
                  server_default=text("'{}'::jsonb"))

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(),
                        nullable=False)

    room = relationship("Room")
    warehouse = relationship("Warehouse")


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer,
                      ForeignKey("inventory_batches.id",
                                 ondelete="SET NULL"),
                      nullable=True)
    item_id = Column(Integer,
                     ForeignKey("items.id",
                                ondelete="CASCADE"),
                     nullable=False)
    warehouse_id = Column(Integer,
                          ForeignKey("warehouses.id",
                                     ondelete="SET NULL"),
                          nullable=True)
    room_id = Column(Integer,
                     ForeignKey("rooms.id",
                                ondelete="SET NULL"),
                     nullable=True)

    movement_type = Column(Enum(MovementType,
                                name="movement_type"),
                           nullable=False)
    quantity = Column(Numeric, nullable=False)

    reference_type = Column(String(64), nullable=True)
    reference_id = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(),
                        nullable=False)

    tx_id = Column(String(255),
                   nullable=True)

    batch = relationship("InventoryBatch")
    item = relationship("Item")


# =========================================================
# SALES (KEPT INTACT)
# =========================================================

class SalesDocument(Base):
    __tablename__ = "sales_documents"

    id = Column(Integer, primary_key=True, index=True)
    external_bill_id = Column(String(255),
                              nullable=True,
                              unique=True)
    customer = Column(JSONB, nullable=True)
    status = Column(String(64),
                    nullable=False,
                    default="OPEN")

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(),
                        nullable=False)


class SalesLine(Base):
    __tablename__ = "sales_lines"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer,
                     ForeignKey("sales_documents.id",
                                ondelete="CASCADE"),
                     nullable=False)
    item_id = Column(Integer,
                     ForeignKey("items.id",
                                ondelete="SET NULL"),
                     nullable=True)

    qty = Column(Numeric, nullable=False)
    unit_price = Column(Numeric, nullable=True)
    batch_preferred = Column(String(255),
                             nullable=True)


# =========================================================
# ANALYTICS
# =========================================================

class TimeSeriesSales(Base):
    __tablename__ = "time_series_sales"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer,
                     ForeignKey("items.id",
                                ondelete="CASCADE"),
                     nullable=False)
    warehouse_id = Column(Integer,
                          ForeignKey("warehouses.id",
                                     ondelete="SET NULL"),
                          nullable=True)
    date = Column(Date, nullable=False)
    qty_sold = Column(Numeric, nullable=False)
    meta = Column(JSONB, nullable=True)

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(),
                        nullable=False)

    __table_args__ = (
        Index("ix_time_series_item_date",
              "item_id", "date"),
    )


class DailyWarehouseMetrics(Base):
    __tablename__ = "daily_warehouse_metrics"

    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer,
                          ForeignKey("warehouses.id"))
    date = Column(Date, nullable=False)

    total_incoming = Column(Numeric, default=0)
    total_outgoing = Column(Numeric, default=0)
    expired_stock = Column(Numeric, default=0)
    damaged_stock = Column(Numeric, default=0)
    revenue_generated = Column(Numeric, default=0)

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now())

    __table_args__ = (
        Index("ix_daily_warehouse_date",
              "warehouse_id", "date"),
    )


# =========================================================
# ALERTS
# =========================================================

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(64), nullable=False)
    payload = Column(JSONB, nullable=True)
    status = Column(String(32),
                    nullable=False,
                    default="OPEN")
    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(),
                        nullable=False)
    resolved_at = Column(TIMESTAMP(timezone=True),
                         nullable=True)


# =========================================================
# BILLING
# =========================================================

class BillingDocument(Base):
    __tablename__ = "billing_documents"

    id = Column(Integer, primary_key=True, index=True)
    bill_number = Column(String(128),
                         nullable=False,
                         unique=True)
    billing_type = Column(Enum(BillingType,
                               name="billing_type"),
                          nullable=False)

    supplier_id = Column(Integer,
                         ForeignKey("suppliers.id"),
                         nullable=True)
    customer_info = Column(JSONB, nullable=True)

    warehouse_id = Column(Integer,
                          ForeignKey("warehouses.id"),
                          nullable=False)

    total_amount = Column(Numeric, nullable=True)

    # NEW ADDITIONS
    tax_amount = Column(Numeric, default=0)
    discount_amount = Column(Numeric, default=0)
    net_amount = Column(Numeric, nullable=True)
    payment_status = Column(Enum(PaymentStatus,
                                 name="payment_status"),
                            default=PaymentStatus.PENDING)
    payment_mode = Column(String(64), nullable=True)
    due_date = Column(Date, nullable=True)

    invoice_file_path = Column(String(512),
                               nullable=True)

    status = Column(String(64),
                    default="OPEN")

    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(),
                        nullable=False)

    lines = relationship("BillingLine",
                         back_populates="bill",
                         cascade="all, delete")


class BillingLine(Base):
    __tablename__ = "billing_lines"

    id = Column(Integer,
                primary_key=True,
                index=True)

    bill_id = Column(Integer,
                     ForeignKey("billing_documents.id",
                                ondelete="CASCADE"),
                     nullable=False)

    item_id = Column(Integer,
                     ForeignKey("items.id",
                                ondelete="SET NULL"),
                     nullable=False)

    quantity = Column(Numeric, nullable=False)
    unit_price = Column(Numeric, nullable=False)
    total_price = Column(Numeric, nullable=False)

    bill = relationship("BillingDocument",
                        back_populates="lines")
    item = relationship("Item")
