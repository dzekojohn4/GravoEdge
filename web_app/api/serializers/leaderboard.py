"""
Serializers for leaderboard data.
"""

from pydantic import BaseModel

class UserLeaderboardItem(BaseModel):
    wallet_id: str
    positions_number: int

