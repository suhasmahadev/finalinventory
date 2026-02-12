# backend/routers/billing.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional

from dependencies import get_db
from services.billing_service import BillingService
from models.schema import BillingType


router = APIRouter(prefix="/billing", tags=["Billing"])

billing_service = BillingService()


# =========================================================
# REQUEST MODELS
# =========================================================

class BillingLineInput(BaseModel):
    item_id: int
    quantity: float
    unit_price: float
    room_id: Optional[int] = None


class CreateBillRequest(BaseModel):
    billing_type: BillingType
    warehouse_id: int
    supplier_id: Optional[int] = None
    customer_info: Optional[dict] = None
    agent_id: Optional[int] = None
    items: List[BillingLineInput]


# =========================================================
# CREATE BILL (DRAFT)
# =========================================================
@router.post("/")
async def create_bill(
    payload: CreateBillRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await billing_service.create_bill(
            db=db,
            billing_type=payload.billing_type,
            warehouse_id=payload.warehouse_id,
            supplier_id=payload.supplier_id,
            customer_info=payload.customer_info,
            agent_id=payload.agent_id,
            items=[item.dict() for item in payload.items],
        )
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# POST BILL (APPLY STOCK + GENERATE INVOICE)
# =========================================================
@router.post("/{bill_id}/post")
async def post_bill(
    bill_id: int,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await billing_service.post_bill(
            db=db,
            bill_id=bill_id,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# GET BILL BY ID
# =========================================================
@router.get("/{bill_id}")
async def get_bill(
    bill_id: int,
    db: AsyncSession = Depends(get_db),
):
    bill = await billing_service.billing_repo.get_bill_with_lines(
        db=db,
        bill_id=bill_id,
    )

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    return {
        "id": bill.id,
        "bill_number": bill.bill_number,
        "billing_type": bill.billing_type,
        "warehouse_id": bill.warehouse_id,
        "supplier_id": bill.supplier_id if bill.supplier_id else None,
        "customer_info": bill.customer_info,
        "status": bill.status,
        "total_amount": float(bill.total_amount or 0),
        "invoice_file_path": bill.invoice_file_path,
        "created_at": bill.created_at,
        "lines": [
            {
                "item_id": line.item_id,
                "quantity": float(line.quantity),
                "unit_price": float(line.unit_price),
                "total_price": float(line.total_price),
            }
            for line in bill.lines
        ],
    }


# =========================================================
# GET BILL BY NUMBER
# =========================================================
@router.get("/number/{bill_number}")
async def get_bill_by_number(
    bill_number: str,
    db: AsyncSession = Depends(get_db),
):
    bill = await billing_service.billing_repo.get_bill_by_number(
        db=db,
        bill_number=bill_number,
    )

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    return {
        "id": bill.id,
        "bill_number": bill.bill_number,
        "billing_type": bill.billing_type,
        "warehouse_id": bill.warehouse_id,
        "status": bill.status,
        "total_amount": float(bill.total_amount or 0),
        "invoice_file_path": bill.invoice_file_path,
        "created_at": bill.created_at,
    }


# =========================================================
# LIST ALL BILLS
# =========================================================
@router.get("/")
async def list_bills(
    db: AsyncSession = Depends(get_db),
):
    bills = await billing_service.billing_repo.list_bills(db)

    return {
        "count": len(bills),
        "data": [
            {
                "id": bill.id,
                "bill_number": bill.bill_number,
                "billing_type": bill.billing_type,
                "status": bill.status,
                "total_amount": float(bill.total_amount or 0),
                "created_at": bill.created_at,
            }
            for bill in bills
        ],
    }
