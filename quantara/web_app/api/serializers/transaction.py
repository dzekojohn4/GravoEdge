"""
This module defines the serializers for the transaction data
in the Stellar-based Quantara protocol.
"""

from decimal import Decimal
from pydantic import BaseModel


class DepositData(BaseModel):
    """
    Pydantic model for the deposit data used in Soroban loop_liquidity calls.
    """

    token: str
    amount: str
    multiplier: Decimal
    borrow_portion_percent: int


class LoopLiquidityData(BaseModel):
    """
    Pydantic model for the loop liquidity data response.
    """

    deposit_data: DepositData
    contract_address: str | None = None
    position_id: str | None = None
    caller: str | None = None


class RepayTransactionDataResponse(BaseModel):
    """
    Pydantic model for the repay transaction data response.
    """

    supply_token: str
    debt_token: str
    contract_address: str | None = None
    borrow_portion_percent: int
    position_id: str | None = None


class UpdateUserContractRequest(BaseModel):
    """
    Pydantic model for the update user contract request.
    """

    wallet_id: str
    contract_address: str


class WithdrawAllData(BaseModel):
    """
    Response model to withdraw all, containing repay data and token addresses.
    """

    repay_data: RepayTransactionDataResponse
    tokens: list[str]
