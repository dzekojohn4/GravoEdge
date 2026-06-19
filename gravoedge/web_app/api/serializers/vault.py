"""
Pydantic schemas for vault deposit operations.
Defines request and response models for the vault deposit API endpoints.
"""

from uuid import UUID

from pydantic import BaseModel, Field


class VaultDepositRequest(BaseModel):
    """
    Schema for vault deposit request.
    """

    wallet_id: str = Field(..., description="Stellar wallet address (G… public key)")
    amount: str = Field(..., description="Amount to deposit")
    symbol: str = Field(..., description="Token symbol/address")


class VaultDepositResponse(BaseModel):
    """
    Schema for vault deposit response.
    """

    deposit_id: UUID
    wallet_id: str
    amount: str
    symbol: str


class VaultBalanceResponse(BaseModel):
    """
    Schema for vault balance response.
    """

    wallet_id: str
    symbol: str
    amount: str


class UpdateVaultBalanceRequest(BaseModel):
    """
    Schema for the request to update a user's vault balance.
    """

    wallet_id: str
    symbol: str
    amount: str


class UpdateVaultBalanceResponse(BaseModel):
    """
    Schema for the response when updating a vault balance.
    """

    wallet_id: str
    symbol: str
    amount: str
