"""
Serializers for airdrop data.
"""

from pydantic import BaseModel


class AirdropItem(BaseModel):
    """Model for individual airdrop items."""

    amount: str
    proof: list[str]
    is_claimed: bool
    recipient: str


class AirdropResponseModel(BaseModel):
    """Model for the complete airdrop response."""

    airdrops: list[AirdropItem]
