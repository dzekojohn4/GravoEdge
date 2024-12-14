from asyncio import get_event_loop
from unittest.mock import MagicMock

import pytest
from httpx import AsyncClient  # Use of httpx instead TestClient
from fastapi.testclient import TestClient

from web_app.api.main import app
from web_app.db.crud import (
    DBConnector,
    PositionDBConnector,
    UserDBConnector,
)
from web_app.db.database import get_database

@pytest.fixture(scope="module")
def mock_db_connector():
    return MagicMock(spec=DBConnector)

@pytest.fixture(scope="module")
def mock_user_db_connector():
    return MagicMock(spec=UserDBConnector)

@pytest.fixture(scope="module")
def mock_position_db_connector():
    return MagicMock(spec=PositionDBConnector)

@pytest.fixture(scope="module")
async def async_client(mock_db_connector):
    """
    Async test client with database dependency overridden.
    """
    app.dependency_overrides[get_database] = lambda: mock_db_connector

    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client

    # Clear the overrides after the test
    app.dependency_overrides.clear()

@pytest.fixture(scope="module")
def client(async_client):
    """
    Compatibility wrapper around the async client
    """
    return async_client