"""
This file contains the Pydantic schema for the MarginPosition model.
"""

from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class MarginPositionCreate(BaseModel):
    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    transaction_id: str


class MarginPositionResponse(BaseModel):
    id: UUID
    user_id: UUID
    borrowed_amount: Decimal
    multiplier: int
    transaction_id: str

    class Config:
        orm_mode: True
