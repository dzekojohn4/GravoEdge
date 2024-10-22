import pytest

from unittest.mock import MagicMock


@pytest.fixture(scope="function")
def mock_db_session(mocker):
    mock_db_session = MagicMock()
    mocker.patch("web_app.api.main.app.SessionLocal", return_value=mock_db_session)
    yield mock_db_session
