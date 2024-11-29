"""
Test cases for deleting all user airdrop operations.
"""

import pytest
from unittest.mock import MagicMock, patch
from uuid import uuid4
from sqlalchemy.exc import SQLAlchemyError
from web_app.db.crud.airdrop import AirDropDBConnector

@pytest.fixture
def mock_session():
    """Fixture for mocking the database session."""
    with patch("web_app.db.crud.airdrop.AirDropDBConnector.Session") as MockSession:
        yield MockSession

def test_delete_all_users_airdrop_valid_user(mock_session):
    """Test deletion of all airdrops for a valid user."""
    user_id = uuid4()
    mock_db = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_db

    # Create mock airdrops with varying `is_claimed` statuses.
    mock_airdrops = [
        MagicMock(id=uuid4(), is_claimed=False, claimed_at=None),
        MagicMock(id=uuid4(), is_claimed=True, claimed_at="2024-11-29"),
    ]
    mock_db.query.return_value.filter_by.return_value.all.return_value = mock_airdrops

    connector = AirDropDBConnector()
    connector.delete_all_users_airdrop(user_id)

    assert mock_db.delete.call_count == len(mock_airdrops)
    for airdrop in mock_airdrops:
        mock_db.delete.assert_any_call(airdrop)

    mock_db.commit.assert_called_once()

def test_delete_all_users_airdrop_no_airdrops(mock_session):
    """Test deletion when no airdrops exist for the user."""
    user_id = uuid4()
    mock_db = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_db

    mock_db.query.return_value.filter_by.return_value.all.return_value = []

    connector = AirDropDBConnector()
    connector.delete_all_users_airdrop(user_id)

    mock_db.delete.assert_not_called()
    mock_db.commit.assert_called_once()

def test_delete_all_users_airdrop_invalid_uuid(mock_session):
    """Test deletion with an invalid UUID."""
    connector = AirDropDBConnector()

    with pytest.raises(Exception):
        connector.delete_all_users_airdrop("invalid-uuid")

def test_delete_all_users_airdrop_db_error(mock_session):
    """Test deletion when a database error occurs."""
    user_id = uuid4()
    mock_db = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_db

    mock_db.query.side_effect = SQLAlchemyError("Database error")

    connector = AirDropDBConnector()

    with pytest.raises(SQLAlchemyError):
        connector.delete_all_users_airdrop(user_id)

    mock_db.commit.assert_not_called()

def test_delete_all_users_airdrop_logs_error(mock_session, caplog):
    """Test that errors are logged correctly when deletion fails."""
    user_id = uuid4()
    mock_db = MagicMock()
    mock_session.return_value.__enter__.return_value = mock_db

    mock_db.query.side_effect = SQLAlchemyError("Database error")

    connector = AirDropDBConnector()

    with pytest.raises(SQLAlchemyError):
        connector.delete_all_users_airdrop(user_id)

    assert "Database error" in caplog.text
