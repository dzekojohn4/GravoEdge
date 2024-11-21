"""
Pydantic schemas for vault deposit operations.
Defines request and response models for the vault deposit API endpoints.
"""

from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class VaultDepositRequest(BaseModel):
    """
    Schema for vault deposit request used to create a new deposit record.

    Attributes:
        wallet_id (str): Starknet wallet address
        amount (Decimal): Amount to deposit
        symbol (str): Token symbol or address
    """

    wallet_id: str = Field(..., description="Starknet wallet address")
    amount: Decimal = Field(..., gt=0, description="Amount to deposit")
    symbol: str = Field(..., description="Token symbol/address")


class VaultDepositResponse(BaseModel):
    """
    Schema for vault deposit response.

    Attributes:
        deposit_id (int): Unique identifier for the deposit
        wallet_id (str): Starknet wallet address
        amount (Decimal): Deposited amount
        symbol (str): Token symbol or address
        status (str): Current status of the deposit
    """

    deposit_id: int
    wallet_id: str
    amount: Decimal
    symbol: str
    status: str
