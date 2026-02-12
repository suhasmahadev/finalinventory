# backend/services/billing_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
import os
import random

from repos.billing_repo import BillingRepo
from services.inventory_service import InventoryService
from models.schema import BillingType


class BillingService:

    def __init__(self):
        self.billing_repo = BillingRepo()
        self.inventory_service = InventoryService()

    # =========================================================
    # CREATE BILL (DRAFT)
    # =========================================================
    async def create_bill(
        self,
        db: AsyncSession,
        billing_type: BillingType,
        warehouse_id: int,
        customer_info: Optional[dict],
        items: List[dict],  # [{item_id, quantity, unit_price, room_id}]
    ):

        if not items:
            raise ValueError("Invoice must contain at least one item")

        async with db.begin():

            bill_number = f"BILL-{random.randint(10000000, 99999999)}"

            bill = await self.billing_repo.create_bill(
                db=db,
                bill_number=bill_number,
                billing_type=billing_type,
                warehouse_id=warehouse_id,
                customer_info=customer_info,
                status="DRAFT",
            )

            total_amount = 0

            for item in items:

                line_total = item["quantity"] * item["unit_price"]
                total_amount += line_total

                await self.billing_repo.create_line(
                    db=db,
                    bill_id=bill.id,
                    item_id=item["item_id"],
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    total_price=line_total,
                )

            await self.billing_repo.update_bill_total(
                db=db,
                bill_id=bill.id,
                total_amount=total_amount,
            )

            return {
                "bill_id": bill.id,
                "bill_number": bill_number,
                "status": "DRAFT"
            }

    # =========================================================
    # POST BILL (APPLY STOCK + GENERATE INVOICE FILE)
    # =========================================================
    async def post_bill(
        self,
        db: AsyncSession,
        bill_id: int,
    ):

        async with db.begin():

            bill = await self.billing_repo.get_bill_with_lines(db, bill_id)
            if not bill:
                raise ValueError("Bill not found")

            if bill.status != "DRAFT":
                raise ValueError("Only DRAFT bills can be posted")

            for line in bill.lines:

                if bill.billing_type == BillingType.INCOMING:

                    # Add stock
                    await self.inventory_service.add_stock(
                        db=db,
                        item_id=line.item_id,
                        quantity=line.quantity,
                        room_id=None,  # YOU MUST DECIDE ROOM LOGIC HERE
                        batch_number=None,
                        expiry_date=None,
                        purchase_price=line.unit_price,
                        reference_type="BILL_IN",
                        reference_id=str(bill.id),
                    )

                elif bill.billing_type == BillingType.OUTGOING:

                    # Deduct stock
                    await self.inventory_service.deduct_stock(
                        db=db,
                        item_id=line.item_id,
                        quantity=line.quantity,
                        reference_type="BILL_OUT",
                        reference_id=str(bill.id),
                    )

            # Update bill status
            await self.billing_repo.update_bill_status(
                db=db,
                bill_id=bill.id,
                status="POSTED"
            )

            # Generate invoice file
            file_path = self._generate_invoice_file(bill)

            await self.billing_repo.update_invoice_path(
                db=db,
                bill_id=bill.id,
                file_path=file_path
            )

            return {
                "bill_id": bill.id,
                "status": "POSTED",
                "invoice_file": file_path
            }

    # =========================================================
    # INVOICE GENERATOR (SIMPLE TEXT → PDF/IMAGE READY)
    # =========================================================
    def _generate_invoice_file(self, bill):

        directory = "generated_invoices"
        os.makedirs(directory, exist_ok=True)

        file_path = f"{directory}/{bill.bill_number}.txt"

        with open(file_path, "w") as f:
            f.write(f"Invoice: {bill.bill_number}\n")
            f.write(f"Date: {datetime.utcnow()}\n")
            f.write(f"Type: {bill.billing_type}\n\n")

            for line in bill.lines:
                f.write(
                    f"Item: {line.item_id} | "
                    f"Qty: {line.quantity} | "
                    f"Price: {line.unit_price} | "
                    f"Total: {line.total_price}\n"
                )

            f.write(f"\nGrand Total: {bill.total_amount}")

        return file_path
