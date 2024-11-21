from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional

class VaultDepositRequest(BaseModel):
    wallet_id: str = Field(..., description="Starknet wallet address")
    amount: Decimal = Field(..., gt=0, description="Amount to deposit")
    symbol: str = Field(..., description="Token symbol/address")

class VaultDepositResponse(BaseModel):
    deposit_id: int
    wallet_id: str
    amount: Decimal
    symbol: str
    status: str