from decimal import Decimal
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, validator

from web_app.contract_tools.constants import TokenParams


class PositionData(BaseModel):
    """
    Data related to a position.
    """

    apy: str
    group: Optional[int]
    lending: bool
    collateral: bool
    debt: bool


class Position(BaseModel):
    """
    Data related to a position.
    """

    token_address: Optional[str] = Field(None, alias="tokenAddress")  # Made optional
    total_balances: Dict[str, str] = Field(alias="totalBalances")
    data: PositionData

    @validator("total_balances", pre=True, each_item=False)
    def convert_total_balances(cls, balances, values):
        """
        Convert total_balances to their decimal values based on token decimals.
        """
        converted_balances = {}
        for token_address, balance in balances.items():
            try:
                # Fetch the token decimals from TokenParams
                decimals = TokenParams.get_token_decimals(token_address)
                # Convert the balance using the decimals
                converted_balances[token_address] = str(
                    Decimal(balance) / Decimal(10**decimals)
                )
            except ValueError as e:
                raise ValueError(f"Error in balance conversion: {str(e)}")
        return converted_balances


class GroupData(BaseModel):
    """
    Data related to a group.
    """

    health_ratio: str = Field(alias="healthRatio")


class Product(BaseModel):
    """
    Data related to a product.
    """

    name: str
    manage_url: Optional[str] = Field(
        None, alias="manageUrl"
    )  # This field might not always be present
    groups: Dict[str, GroupData]
    positions: Optional[List[Position]]
    type: str


class Dapp(BaseModel):
    """
    Data related to a Dapp.
    """

    dappId: str
    products: List[Product]


class ZkLendPositionResponse(BaseModel):
    """
    Response data for the ZkLend position.
    """

    dapps: List[Dapp]

