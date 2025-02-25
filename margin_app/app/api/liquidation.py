"""
This module contains the LiquidationAPI class for managing liquidation endpoints.
"""

from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.liquidation import LiquidationCRUD
from app.schemas.liquidation import LiquidationResponse
from app.db.sessions import get_db

router = APIRouter()


class LiquidationAPI:
    """
    API class for handling liquidation endpoints.
    """

    def __init__(self, liquidation_crud: LiquidationCRUD):
        self.liquidation_crud = liquidation_crud

    async def liquidate_position(
        self,
        margin_position_id: UUID,
        bonus_amount: Decimal,
        bonus_token: str,
        _db: AsyncSession = Depends(get_db),
    ) -> LiquidationResponse:
        """
        Liquidates a margin position by adding a liquidation record.

        Args:
            margin_position_id (UUID): The ID of the margin position.
            bonus_amount (Decimal): The amount of bonus applied.
            bonus_token (str): The token used for the bonus.
            _db (AsyncSession, optional): The database session (unused but needed for DI).

        Returns:
            LiquidationResponse: Details of the liquidation entry.
        """
        try:
            liquidation_entry = await self.liquidation_crud.liquidate_position(
                margin_position_id, bonus_amount, bonus_token
            )
            return LiquidationResponse(
                margin_position_id=liquidation_entry.margin_position_id,
                bonus_amount=liquidation_entry.bonus_amount,
                bonus_token=liquidation_entry.bonus_token,
                status="success",
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    async def get_liquidation_status(self, margin_position_id: UUID) -> dict:
        """
        Fetches the liquidation status of a given margin position.

        Args:
            margin_position_id (UUID): The ID of the margin position.

        Returns:
            dict: Liquidation status.
        """
        try:
            status = await self.liquidation_crud.get_liquidation_status(margin_position_id)
            return {"margin_position_id": str(margin_position_id), "status": status}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e)) from e


liquidation_api = LiquidationAPI(LiquidationCRUD())


@router.post("/liquidate", response_model=LiquidationResponse)
async def liquidate_position(
    margin_position_id: UUID,
    bonus_amount: Decimal,
    bonus_token: str,
    db: AsyncSession = Depends(get_db),
):
    """
    FastAPI route for liquidating a position.

    Args:
        margin_position_id (UUID): The ID of the margin position.
        bonus_amount (Decimal): The amount of bonus applied.
        bonus_token (str): The token used for the bonus.
        db (AsyncSession, optional): The database session.

    Returns:
        LiquidationResponse: Details of the liquidation entry.
    """
    return await liquidation_api.liquidate_position(
        margin_position_id, bonus_amount, bonus_token, db
        )
