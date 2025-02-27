"""
Tests for margin position API endpoints.
"""
import uuid
from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from httpx import AsyncClient

from app.api.margin_position import router
from app.models.margin_position import MarginPositionStatus
from app.schemas.margin_position import MarginPositionResponse, CloseMarginPositionResponse


@pytest.fixture
def app():
    """
    Create a FastAPI app for testing.
    """
    app = FastAPI()
    app.include_router(router, prefix="/margin-positions")
    return app


@pytest.fixture
def client(app):
    """
    Create a test client for the app.
    """
    return TestClient(app)


@pytest.fixture
def mock_open_margin_position():
    """
    Mock the open_margin_position method of margin_position_crud.
    """
    with patch("app.api.margin_position.margin_position_crud.open_margin_position") as mock:
        yield mock


@pytest.fixture
def mock_close_margin_position():
    """
    Mock the close_margin_position method of margin_position_crud.
    """
    with patch("app.api.margin_position.margin_position_crud.close_margin_position") as mock:
        yield mock


@pytest.fixture
def valid_position_data():
    """
    Create valid position data for testing.
    """
    return {
        "user_id": str(uuid.uuid4()),
        "borrowed_amount": 1000.00,
        "multiplier": 5,
        "transaction_id": "txn_123456789",
    }


@pytest.mark.asyncio
async def test_open_margin_position_success(client, valid_position_data, mock_open_margin_position):
    """Test successfully opening a margin position."""
    data = valid_position_data
    valid_position_response = MarginPositionResponse(id=str(uuid.uuid4()), status="Open", liquidated_at=None, **data)
    mock_open_margin_position.return_value = valid_position_response
    
    response = client.post("/margin-positions/open", json=data)
    assert response.status_code == 200
    assert response.json()["user_id"] == data["user_id"]
    assert response.json()["borrowed_amount"] == str(data["borrowed_amount"])
    assert response.json()["multiplier"] == data["multiplier"]
    assert response.json()["status"] == "Open"
    mock_open_margin_position.assert_called_once()


@pytest.mark.asyncio
async def test_close_margin_position_success(client, mock_close_margin_position):
    """Test successfully closing a margin position."""
    position_id = uuid.uuid4()
    mock_close_margin_position.return_value = MarginPositionStatus.CLOSED
    
    response = client.post(f"/margin-positions/close/{position_id}")
    
    assert response.status_code == 200
    assert response.json()["position_id"] == str(position_id)
    assert response.json()["status"] == "Closed"
    mock_close_margin_position.assert_called_once_with(position_id)


