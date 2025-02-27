from typing import NoReturn
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.margin_position import margin_position_crud
from app.db.sessions import get_db
from app.schemas.margin_position import CloseMarginPositionResponse

router = APIRouter()


@router.post("/close/{position_id}", response_model=CloseMarginPositionResponse)
async def close_margin_position(position_id: UUID) -> CloseMarginPositionResponse:
    """
    Close a margin position endpoint.

    Args:
        position_id (UUID): The unique identifier of the margin position to close

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
