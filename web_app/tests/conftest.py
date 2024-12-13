"""
This module contains the fixtures for the tests.
"""

from unittest.mock import MagicMock

import pytest
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
    """
    Mock DBConnector.
    :return: Mock instance of DBConnector
    """
    return MagicMock(spec=DBConnector)


@pytest.fixture(scope="module")
def mock_user_db_connector():
    """
    Mock for UserDBConnector.
    :return: Mock instance of UserDBConnector
    """
    return MagicMock(spec=UserDBConnector)


@pytest.fixture(scope="module")
def mock_position_db_connector():
    """
    Mock for PositionDBConnector.
    :return: Mock instance of PositionDBConnector
    """
    return MagicMock(spec=PositionDBConnector)


@pytest.fixture(scope="module")
def mock_app_client(mock_db_connector):
    """
    Mocked app client with database dependency overridden.
    :param mock_db_connector: The mock database connector.
    :return: TestClient instance with mocked app.
    """

    # Override the `get_database` dependency with the mock connector
    app.dependency_overrides[get_database] = lambda: mock_db_connector

    with TestClient(app) as client:
        yield client

    # Clear the overrides after the test
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def client(mock_app_client):
    """
    TestClient using the mock_app_client fixture.
    :return: TestClient instance
    """
    return mock_app_client
