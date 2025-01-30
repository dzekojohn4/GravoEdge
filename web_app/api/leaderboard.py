from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from web_app.db.crud.leaderboard import LeaderboardDBConnector
from web_app.db.session import get_db
from web_app.api.serializers.leaderboard import UserLeaderboardItem, TokenPositionStatistic

router = APIRouter()

@router.get(
    "/api/get-user-leaderboard",
    tags=["Leaderboard"],
    response_model=list[UserLeaderboardItem],
    summary="Get user leaderboard",
    response_description="Returns the top 10 users ordered by closed/opened positions.",
)
async def get_user_leaderboard(db: Session = Depends(get_db)) -> list[UserLeaderboardItem]:
    """
    Get the top 10 users ordered by closed/opened positions.
    """
    leaderboard_crud = LeaderboardDBConnector(db)
    leaderboard_data = leaderboard_crud.get_top_users_by_positions()
    return leaderboard_data


@router.get(
    "/api/get-position-tokens-statistic",
    tags=["Leaderboard"],
    response_model=list[TokenPositionStatistic],
    summary="Get statistics of positions by token",
    response_description="Returns statistics of opened/closed positions by token",
)
async def get_position_tokens_statistic(db: Session = Depends(get_db)) -> list[TokenPositionStatistic]:
    """
    This endpoint retrieves statistics about positions grouped by token symbol.
    Returns counts of opened and closed positions for each token.
    """
    leaderboard_crud = LeaderboardDBConnector(db)
    return leaderboard_crud.get_position_token_statistics()
