"""
Module containing pool-related API endpoints.
"""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from web_app.api.serializers.pool import PoolResponse
from web_app.db.database import get_session
from web_app.db.models import Pool

router = APIRouter(prefix="/pool", tags=["pool"])


@router.get("/{pool_id}", response_model=PoolResponse)
async def get_pool(
    pool_id: UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> PoolResponse:
    """
    Get pool details by ID.

    Args:
        pool_id: UUID of the pool
        session: Database session

    Returns:
        PoolResponse: Pool details

    Raises:
        HTTPException: If pool is not found
    """
    query = select(Pool).where(Pool.id == pool_id)
    result = await session.execute(query)
    pool = result.scalar_one_or_none()

    if not pool:
        raise HTTPException(status_code=404, detail="Pool not found")

    return PoolResponse.from_orm(pool)
