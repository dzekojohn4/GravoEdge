"""
Test cases for deleting user positions.
"""

import uuid
import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from web_app.db.models import Position
from web_app.db.crud.position import PositionDBConnector


@pytest.fixture
def mock_session():
    """
    Provides a mock SQLAlchemy session.
    """
    session = MagicMock(spec=Session)
    return session


@pytest.fixture
def connector(mock_session):
    """
    Provides a PositionDBConnector instance with a mocked session.
    """
    connector = PositionDBConnector()
    connector.Session = MagicMock(return_value=mock_session)
    return connector


def test_delete_all_user_positions_success(mock_session, connector):
    """
    Test that all user positions are successfully deleted.
    """
    user_id = uuid.uuid4()

    mock_positions = [
        MagicMock(spec=Position, id=uuid.uuid4(), status="pending"),
        MagicMock(spec=Position, id=uuid.uuid4(), status="opened")
    ]
    mock_session.query().filter_by().all.return_value = mock_positions

    connector.delete_all_user_positions(user_id)

    mock_session.query().filter_by.assert_called_once_with(user_id=user_id)
    assert mock_session.delete.call_count == len(mock_positions)
    mock_session.commit.assert_called_once()


def test_delete_all_user_positions_no_positions(mock_session, connector):
    """
    Test that the method handles cases where there are no positions to delete.
    """
    user_id = uuid.uuid4()

    mock_session.query().filter_by().all.return_value = []

    connector.delete_all_user_positions(user_id)

    mock_session.query().filter_by.assert_called_once_with(user_id=user_id)
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()


def test_delete_all_user_positions_sqlalchemy_error(mock_session, connector):
    """
    Test that an SQLAlchemy error is handled gracefully.
    """
    user_id = uuid.uuid4()

    mock_session.query().filter_by.side_effect = SQLAlchemyError("Database error")

    connector.delete_all_user_positions(user_id)

    mock_session.query().filter_by.assert_called_once_with(user_id=user_id)
    mock_session.rollback.assert_called_once()


def test_delete_all_user_positions_with_multipliers(mock_session, connector):
    """
    Test deletion of user positions considering the multiplier attribute.
    """
    user_id = uuid.uuid4()

    # Mock positions with a multiplier (can represent special logic)
    mock_positions = [
        MagicMock(spec=Position, id=uuid.uuid4(), multiplier=2),
        MagicMock(spec=Position, id=uuid.uuid4(), multiplier=3)
    ]
    mock_session.query().filter_by().all.return_value = mock_positions

    connector.delete_all_user_positions(user_id)

    mock_session.query().filter_by.assert_called_once_with(user_id=user_id)
    assert mock_session.delete.call_count == len(mock_positions)
    mock_session.commit.assert_called_once()


def test_delete_all_user_positions_with_liquidation(mock_session, connector):
    """
    Test deletion of positions that have been liquidated.
    """
    user_id = uuid.uuid4()

    mock_positions = [
        MagicMock(spec=Position, id=uuid.uuid4(), is_liquidated=True),
        MagicMock(spec=Position, id=uuid.uuid4(), is_liquidated=True)
    ]
    mock_session.query().filter_by().all.return_value = mock_positions

    connector.delete_all_user_positions(user_id)

    mock_session.query().filter_by.assert_called_once_with(user_id=user_id)
    assert mock_session.delete.call_count == len(mock_positions)
    mock_session.commit.assert_called_once()


def test_delete_all_user_positions_with_invalid_uuid(mock_session, connector):
    """
    Test that an invalid UUID raises an error when attempting to delete positions.
    """
    invalid_user_id = "invalid-uuid"

    with pytest.raises(ValueError, match="Invalid user UUID"):
        connector.delete_all_user_positions(invalid_user_id)
    
    mock_session.rollback.assert_not_called()
