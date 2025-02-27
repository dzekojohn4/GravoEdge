"""
This module contains Pydantic schemas for User.
"""

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class UserBase(BaseModel):
    """
    User base model
    """

    id: int
    wallet_id: str
    created_at: datetime

class UserCreate(UserBase):
    """
    User create model
    """

    pass

class UserResponse(UserBase):
    """
    User response model
    """

    id: UUID

    model_config = ConfigDict(from_attributes=True)


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