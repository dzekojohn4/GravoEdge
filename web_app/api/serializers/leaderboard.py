from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from web_app.db.crud import PositionDBConnector

router = APIRouter()
position_db_connector = PositionDBConnector()

class UserLeaderboardItem(BaseModel):
    wallet_id: str
    positions_number: int

class UserLeaderboardResponse(BaseModel):
    leaderboard: List[UserLeaderboardItem]

@router.get(
    "/api/get-user-leaderboard",
    tags=["Leaderboard"],
    response_model=UserLeaderboardResponse,
    summary="Get user leaderboard",
    response_description="Returns the top 10 users ordered by closed/opened positions.",
)
async def get_user_leaderboard() -> UserLeaderboardResponse:
    """
    Get the top 10 users ordered by closed/opened positions.
    """
    leaderboard_data = position_db_connector.get_top_users_by_positions()
    return UserLeaderboardResponse(leaderboard=leaderboard_data)