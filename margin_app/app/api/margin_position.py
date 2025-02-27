"""
This module contains the API routes for margin positions.
"""

from typing import NoReturn
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.margin_position import margin_position_crud
from app.db.sessions import get_db
from app.schemas.margin_position import (
    CloseMarginPositionResponse,
    MarginPositionCreate,
    MarginPositionResponse,
)

router = APIRouter()


@router.post("/open", response_model=MarginPositionResponse)
async def open_margin_position(
    position_data: MarginPositionCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Opens a margin position by creating an entry record in the database.
    :param position_data: MarginPositionCreate
    :param db: AsyncSession
    :return: MarginPositionResponse
    """
    margin_position_crud.db = db
    position = await margin_position_crud.open_margin_position(
        user_id=position_data.user_id,
        borrowed_amount=position_data.borrowed_amount,
        multiplier=position_data.multiplier,
        transaction_id=position_data.transaction_id,
    )
    return position


@router.post("/close/{position_id}", response_model=CloseMarginPositionResponse)
async def close_margin_position(
    position_id: UUID, db: AsyncSession = Depends(get_db)
) -> CloseMarginPositionResponse:
    """
    Close a margin position endpoint.

    Args:
        position_id (UUID): The unique identifier of the margin position to close
        db (AsyncSession): Database session dependency injected by FastAPI

    Returns:
        CloseMarginPositionResponse: Object containing the position ID and its updated status

    Raises:
        HTTPException: 404 error if the position is not found
    """
    margin_position_crud.db = db
    status = await margin_position_crud.close_margin_position(position_id)

    if not status:
        raise HTTPException(
            status_code=404, detail=f"Margin position with id {position_id} not found"
        )

    return CloseMarginPositionResponse(position_id=position_id, status=status)
