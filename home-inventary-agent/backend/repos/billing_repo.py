# backend/repos/billing_repo.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from typing import Optional

from models.schema import BillingDocument, BillingLine


class BillingRepo:

    # =====================================================
    # CREATE BILL
    # =====================================================
    async def create_bill(
        self,
        db: AsyncSession,
        bill_number: str,
        billing_type,
        warehouse_id: int,
        supplier_id: Optional[int],
        customer_info: Optional[dict],
        agent_id: Optional[int],
        status: str,
    ):

        bill = BillingDocument(
            bill_number=bill_number,
            billing_type=billing_type,
            warehouse_id=warehouse_id,
            supplier_id=supplier_id,
            customer_info=customer_info,
            agent_id=agent_id,
            status=status,
        )

        db.add(bill)
        await db.flush()  # to get ID immediately
        return bill

    # =====================================================
    # CREATE BILL LINE
    # =====================================================
    async def create_line(
        self,
        db: AsyncSession,
        bill_id: int,
        item_id: int,
        quantity: float,
        unit_price: float,
        total_price: float,
    ):

        line = BillingLine(
            bill_id=bill_id,
            item_id=item_id,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
        )

        db.add(line)
        await db.flush()
        return line

    # =====================================================
    # UPDATE BILL TOTAL
    # =====================================================
    async def update_bill_total(
        self,
        db: AsyncSession,
        bill_id: int,
        total_amount: float,
    ):

        stmt = (
            update(BillingDocument)
            .where(BillingDocument.id == bill_id)
            .values(total_amount=total_amount)
        )

        await db.execute(stmt)

    # =====================================================
    # UPDATE BILL STATUS
    # =====================================================
    async def update_bill_status(
        self,
        db: AsyncSession,
        bill_id: int,
        status: str,
    ):

        stmt = (
            update(BillingDocument)
            .where(BillingDocument.id == bill_id)
            .values(status=status)
        )

        await db.execute(stmt)

    # =====================================================
    # UPDATE INVOICE FILE PATH
    # =====================================================
    async def update_invoice_path(
        self,
        db: AsyncSession,
        bill_id: int,
        file_path: str,
    ):

        stmt = (
            update(BillingDocument)
            .where(BillingDocument.id == bill_id)
            .values(invoice_file_path=file_path)
        )

        await db.execute(stmt)

    # =====================================================
    # GET BILL WITH LINES
    # =====================================================
    async def get_bill_with_lines(
        self,
        db: AsyncSession,
        bill_id: int,
    ):

        stmt = (
            select(BillingDocument)
            .where(BillingDocument.id == bill_id)
            .options(selectinload(BillingDocument.lines))
        )

        result = await db.execute(stmt)
        return result.scalars().first()

    # =====================================================
    # GET BILL BY NUMBER
    # =====================================================
    async def get_bill_by_number(
        self,
        db: AsyncSession,
        bill_number: str,
    ):

        stmt = select(BillingDocument).where(
            BillingDocument.bill_number == bill_number
        )

        result = await db.execute(stmt)
        return result.scalars().first()

    # =====================================================
    # LIST ALL BILLS
    # =====================================================
    async def list_bills(
        self,
        db: AsyncSession,
    ):

        stmt = (
            select(BillingDocument)
            .options(selectinload(BillingDocument.lines))
            .order_by(BillingDocument.created_at.desc())
        )

        result = await db.execute(stmt)
        return result.scalars().all()
