"""
Unit tests for the UserDBConnector module.
"""

import pytest
from unittest.mock import MagicMock
from web_app.db.models import User
from web_app.db.crud import UserDBConnector

def test_get_user_by_wallet_id_success(mock_db_connector):
    """
    Test successful retrieval of user by wallet ID.
    """
    wallet_id = "0x123456789"
    expected_user = User(
        id=1,
        wallet_id=wallet_id,
        username="test_user"
    )
    
    mock_db_connector.get_object_by_field.return_value = expected_user
    user_db = UserDBConnector()
    user_db.get_object_by_field = mock_db_connector.get_object_by_field
    
    result = user_db.get_user_by_wallet_id(wallet_id)
    
    assert result == expected_user
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )

def test_get_user_by_wallet_id_not_found(mock_db_connector):
    """
    Test when user is not found by wallet ID.
    """
    wallet_id = "0x987654321"
    mock_db_connector.get_object_by_field.return_value = None
    user_db = UserDBConnector()
    user_db.get_object_by_field = mock_db_connector.get_object_by_field
    
    result = user_db.get_user_by_wallet_id(wallet_id)
    
    assert result is None
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )

def test_get_user_by_wallet_id_empty_wallet_id(mock_db_connector):
    """
    Test behavior when empty wallet ID is provided.
    """
    wallet_id = ""
    user_db = UserDBConnector()
    user_db.get_object_by_field = mock_db_connector.get_object_by_field
    
    result = user_db.get_user_by_wallet_id(wallet_id)
    
    assert result is None
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )

def test_get_user_by_wallet_id_invalid_type(mock_db_connector):
    """
    Test behavior when invalid wallet ID type is provided.
    """
    wallet_id = None
    user_db = UserDBConnector()
    user_db.get_object_by_field = mock_db_connector.get_object_by_field
    
    with pytest.raises(TypeError):
        user_db.get_user_by_wallet_id(wallet_id)
    mock_db_connector.get_object_by_field.assert_not_called()

def test_get_user_by_wallet_id_db_error(mock_db_connector):
    """
    Test behavior when database operation raises an exception.
    """
    wallet_id = "0x123456789"
    mock_db_connector.get_object_by_field.side_effect = Exception("Database error")
    user_db = UserDBConnector()
    user_db.get_object_by_field = mock_db_connector.get_object_by_field
    
    with pytest.raises(Exception) as exc_info:
        user_db.get_user_by_wallet_id(wallet_id)
    assert str(exc_info.value) == "Database error"
    mock_db_connector.get_object_by_field.assert_called_once_with(
        User,
        "wallet_id",
        wallet_id
    )