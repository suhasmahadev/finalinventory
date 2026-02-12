# backend/routers/movement.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from pydantic import BaseModel

from dependencies import get_db
from services.movement_service import MovementService

router = APIRouter(prefix="/movement", tags=["Movement"])

movement_service = MovementService()


# =========================================================
# REQUEST MODELS
# =========================================================

class AdjustmentRequest(BaseModel):
    batch_id: int
    adjustment_quantity: float
    reason: str
    created_by: Optional[str] = None


class TransferRequest(BaseModel):
    batch_id: int
    target_room_id: int
    quantity: float
    created_by: Optional[str] = None


# =========================================================
# MANUAL STOCK ADJUSTMENT
# =========================================================
@router.post("/adjust")
async def adjust_stock(
    payload: AdjustmentRequest,
    db: AsyncSession = Depends(get_db),
):
    if payload.adjustment_quantity == 0:
        raise HTTPException(
            status_code=400,
            detail="Adjustment quantity cannot be zero",
        )

    try:
        return await movement_service.adjust_stock(
            db=db,
            batch_id=payload.batch_id,
            adjustment_quantity=payload.adjustment_quantity,
            reason=payload.reason,
            created_by=payload.created_by,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================================================
# TRANSFER STOCK (ROOM → ROOM)
# =========================================================
@router.post("/transfer")
async def transfer_stock(
    payload: TransferRequest,
    db: AsyncSession = Depends(get_db),
):
    if payload.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Transfer quantity must be positive",
        )

    try:
        return await movement_service.transfer_stock(
            db=db,
            batch_id=payload.batch_id,
            target_room_id=payload.target_room_id,
            quantity=payload.quantity,
            created_by=payload.created_by,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
