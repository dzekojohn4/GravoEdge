"""
Test module for pool-related API endpoints.
"""
import uuid
from decimal import Decimal

import pytest
from httpx import AsyncClient
from sqlalchemy import insert
from sqlalchemy.ext.asyncio import AsyncSession

from web_app.db.models import Pool

pytestmark = pytest.mark.asyncio


async def test_get_pool_success(
    async_client: AsyncClient,
    async_session: AsyncSession,
):
    """
    Test successful pool retrieval.
    """
    # Create test pool
    pool_id = uuid.uuid4()
    pool_data = {
        "id": pool_id,
        "token_a": "ETH",
        "token_b": "USDC",
        "liquidity": Decimal("1000000.00"),
        "fee": Decimal("0.003"),
    }
    
    await async_session.execute(insert(Pool).values(pool_data))
    await async_session.commit()

    # Test API endpoint
    response = await async_client.get(f"/pool/{pool_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == str(pool_id)
    assert data["token_a"] == pool_data["token_a"]
    assert data["token_b"] == pool_data["token_b"]
    assert Decimal(data["liquidity"]) == pool_data["liquidity"]
    assert Decimal(data["fee"]) == pool_data["fee"]
    assert "created_at" in data
    assert "updated_at" in data


async def test_get_pool_not_found(
    async_client: AsyncClient,
):
    """
    Test pool retrieval with non-existent ID.
    """
    non_existent_id = uuid.uuid4()
    response = await async_client.get(f"/pool/{non_existent_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Pool not found"


async def test_get_pool_invalid_id(
    async_client: AsyncClient,
):
    """
    Test pool retrieval with invalid UUID.
    """
    response = await async_client.get("/pool/invalid-uuid")
    assert response.status_code == 422  # Validation error
