"""
Pydantic serializers for leaderboard data.
"""

from pydantic import BaseModel, Field


class UserLeaderboardItem(BaseModel):
    """Represents statistics for positions of a specific user."""

    wallet_id: str = Field(..., description="Stellar wallet public key")
    positions_number: int = Field(..., description="Number of positions")


class TokenPositionStatistic(BaseModel):
    """Represents statistics for positions of a specific token."""

    token_symbol: str = Field(..., description="Token symbol (e.g. XLM, USDC)")
    total_positions: int = Field(..., description="Total positions for this token")
