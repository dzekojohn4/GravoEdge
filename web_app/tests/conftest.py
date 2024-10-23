import pytest

from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from web_app.api.main import app
from web_app.db.crud import DBConnector, UserDBConnector, PositionDBConnector
from web_app.db.database import get_database, Base, engine


@pytest.fixture(scope="module")
def client(mock_db_connector, mock_user_db_connector, mock_position_db_connector):
    Base.metadata.create_all(bind=engine)

    app.dependency_overrides[get_database] = lambda: mock_db_connector
    app.dependency_overrides[UserDBConnector] = lambda: mock_user_db_connector
    app.dependency_overrides[PositionDBConnector] = lambda:mock_position_db_connector

    with TestClient(app=app) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def mock_db_connector():
    mock_connector = MagicMock(spec=DBConnector)
    yield mock_connector


@pytest.fixture(scope="module")
def mock_user_db_connector():
    mock_user_connector = MagicMock(spec=UserDBConnector)
    yield mock_user_connector


@pytest.fixture(scope="module")
def mock_position_db_connector():
    mock_position_connector = MagicMock(spec=PositionDBConnector)
    yield mock_position_connector
