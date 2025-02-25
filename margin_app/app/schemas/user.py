"""
schemas for user endpoints API
"""

from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel

class AddUserDepositRequest(BaseModel):
    user_id: UUID
    amount: Decimal
    token: str
    transaction_id: str

class AddUserDepositResponse(BaseModel):
    deposit_id: UUID
