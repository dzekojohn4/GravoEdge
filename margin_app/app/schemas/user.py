"""
schemas for user endpoints API
"""

from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from app.models import MarginPosition


class AddUserDepositRequest(BaseModel):
    """
    Request model for adding user deposit
    """

    user_id: UUID
    amount: Decimal
    token: str
    transaction_id: str


class AddUserDepositResponse(BaseModel):
    """
    Response model for adding user deposit
    """

    deposit_id: UUID


class AddMarginPositionRequest(BaseModel):
    """
    Request model for adding margin position
    """

    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    token: str
    transaction_id: str


class AddMarginPositionResponse(BaseModel):
    """
    Response model for adding margin position
    """

    margin_position_id: UUID
