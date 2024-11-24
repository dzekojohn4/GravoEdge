"""
test_vault.py
This module contains unit tests for the vault functionality within the web_app.
It verifies deposit operations, balance retrieval, and balance updates.
"""

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from httpx import AsyncClient
from unittest.mock import patch, MagicMock
import uuid

from web_app.api.main import app
from web_app.db.crud import DepositDBConnector, UserDBConnector

client = TestClient(app)

@pytest.mark.anyio
async def test_deposit_to_vault_success(mock_user_db_connector):
    """
    Test successful vault deposit with valid data.
    """
    test_data = {
        "wallet_id": "test_wallet",
        "symbol": "ETH",
        "amount": "1.0"
    }
    
    mock_user = MagicMock()
    mock_vault = MagicMock()
    mock_vault.id = str(uuid.uuid4())
    mock_vault.amount = "1.0"
    
    with (
        patch.object(UserDBConnector, "__new__", return_value=mock_user_db_connector),
        patch("web_app.db.crud.DepositDBConnector.create_vault", return_value=mock_vault),
    ):
        mock_user_db_connector.get_user_by_wallet_id.return_value = mock_user
        
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/api/vault/deposit", json=test_data)
        
        assert response.status_code == 200
        assert response.json() == {
            "deposit_id": mock_vault.id,
            "wallet_id": test_data["wallet_id"],
            "amount": test_data["amount"],
            "symbol": test_data["symbol"]
        }


@pytest.mark.anyio
async def test_deposit_to_vault_user_not_found(mock_user_db_connector):
    """
    Test vault deposit with non-existent user.
    """
    test_data = {
        "wallet_id": "invalid_wallet",
        "symbol": "ETH",
        "amount": "1.0"
    }
    
    with patch.object(UserDBConnector, "__new__", return_value=mock_user_db_connector):
        mock_user_db_connector.get_user_by_wallet_id.return_value = None
        
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/api/vault/deposit", json=test_data)
        
        assert response.status_code == 404
        assert response.json() == {"detail": "User not found"}


@pytest.mark.anyio
async def test_get_vault_balance_success():
    """
    Test successful retrieval of vault balance.
    """
    wallet_id = "test_wallet"
    symbol = "ETH"
    expected_balance = "1.5"
    
    with patch("web_app.db.crud.DepositDBConnector.get_vault_balance", return_value=expected_balance):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/vault/api/balance?wallet_id={wallet_id}&symbol={symbol}")
        
        assert response.status_code == 200
        assert response.json() == {
            "wallet_id": wallet_id,
            "symbol": symbol,
            "amount": expected_balance
        }


@pytest.mark.anyio
async def test_get_vault_balance_not_found():
    """
    Test retrieval of non-existent vault balance.
    """
    wallet_id = "invalid_wallet"
    symbol = "ETH"
    
    with patch("web_app.db.crud.DepositDBConnector.get_vault_balance", return_value=None):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/vault/api/balance?wallet_id={wallet_id}&symbol={symbol}")
        
        assert response.status_code == 404
        assert response.json() == {"detail": "Vault not found or user does not exist"}


@pytest.mark.anyio
async def test_add_vault_balance_success():
    """
    Test successful addition to vault balance.
    """
    test_data = {
        "wallet_id": "test_wallet",
        "symbol": "ETH",
        "amount": "0.5"
    }
    
    mock_vault = MagicMock()
    mock_vault.amount = "2.0"
    
    with patch("web_app.db.crud.DepositDBConnector.add_vault_balance", return_value=mock_vault):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/api/vault/api/add_balance", json=test_data)
        
        assert response.status_code == 200
        assert response.json() == {
            "wallet_id": test_data["wallet_id"],
            "symbol": test_data["symbol"],
            "amount": mock_vault.amount
        }


@pytest.mark.anyio
async def test_add_vault_balance_invalid_amount():
    """
    Test adding invalid amount to vault balance.
    """
    test_data = {
        "wallet_id": "test_wallet",
        "symbol": "ETH",
        "amount": "-1.0"
    }
    
    with patch(
        "web_app.db.crud.DepositDBConnector.add_vault_balance",
        side_effect=ValueError("Amount must be positive")
    ):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/api/vault/api/add_balance", json=test_data)
        
        assert response.status_code == 400
        assert response.json() == {
            "detail": "Failed to update vault balance: Amount must be positive"
        }
