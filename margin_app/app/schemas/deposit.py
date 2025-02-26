from pydantic import BaseModel
from decimal import Decimal
from uuid import UUID

class DepositUpdate(BaseModel):
    """
    Pydantic model for updating a Deposit.
    """
    token: str
    amount: Decimal
    transaction_id: str


class DepositResponse(BaseModel):
    """
    Pydantic model for a Deposit response.
    """
    id: UUID
    user_id: UUID
    token: str
    amount: Decimal
    transaction_id: str
    created_at: str
    updated_at: str
