from unittest.mock import Mock, patch

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from httpx import AsyncClient
from web_app.api.main import app
from web_app.contract_tools.mixins.deposit import DepositMixin

client = TestClient(app)
app.dependency_overrides.clear()


# Test cases for /api/open-position
@pytest.mark.anyio
async def test_open_position_success(client: AsyncClient) -> None:
    """
    Test for successfully opening a position using a valid position ID.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    position_id = "valid_position_id"
    with patch(
        "web_app.db.crud.PositionDBConnector.open_position"
    ) as mock_open_position:
        mock_open_position.return_value = "Position successfully opened"
        response = client.get(f"/api/open-position?position_id={position_id}")
        assert response.status_code == 200
        assert response.json() == "Position successfully opened"


@pytest.mark.anyio
async def test_open_position_missing_position_data(client: AsyncClient) -> None:
    """
    Test for missing position data, which should return a 404 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    response = client.get("/api/open-position?position_id=")
    assert response.status_code == 404
    assert response.json() == {"detail": "Position not found"}


# Test cases for /api/close-position
@pytest.mark.anyio
async def test_close_position_success(client: AsyncClient) -> None:
    """
    Test for successfully closing a position using a valid position ID.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    position_id = "valid_position_id"
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.return_value = "Position successfully closed"
        response = client.get(f"/api/close-position?position_id={position_id}")
        assert response.status_code == 200
        assert response.json() == "Position successfully closed"


@pytest.mark.anyio
async def test_close_position_invalid_position_id(client: AsyncClient) -> None:
    """
    Test for attempting to close a position using an invalid position ID, which should return a 404 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    invalid_position_id = "invalid_position_id"
    with patch(
        "web_app.db.crud.PositionDBConnector.close_position"
    ) as mock_close_position:
        mock_close_position.side_effect = HTTPException(
            status_code=404, detail="Position not Found"
        )
        response = client.get(f"/api/close-position?position_id={invalid_position_id}")
        assert response.status_code == 404
        assert response.json() == {"detail": "Position not Found"}


# Test cases for /api/get-repay-data
@pytest.mark.anyio
async def test_get_repay_data_success(client: AsyncClient) -> None:
    """
    Test for successfully retrieving repayment data for a valid wallet ID and supply token.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    supply_token = "valid_supply_token"
    wallet_id = "valid_wallet_id"
    mock_repay_data = {
        "supply_token": "mock_supply_token",
        "debt_token": "mock_debt_token",
        "pool_key": {
            "token0": "mock_token0",
            "token1": "mock_token1",
            "fee": "mock_fee",
            "tick_spacing": "mock_tick_spacing",
            "extension": "mock_extension",
        },
        "supply_price": 100,
        "debt_price": 200,
    }
    with (
        patch(
            "web_app.contract_tools.mixins.deposit.DepositMixin.get_repay_data"
        ) as mock_get_repay_data,
        patch(
            "web_app.db.crud.PositionDBConnector.get_contract_address_by_wallet_id"
        ) as mock_get_contract_address,
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_id_by_wallet_id"
        ) as mock_get_position_id,
    ):
        mock_get_repay_data.return_value = mock_repay_data
        mock_get_contract_address.return_value = "mock_contract_address"
        mock_get_position_id.return_value = 123
        mock_get_repay_data.return_value = mock_repay_data
        DepositMixin.get_repay_data = mock_get_repay_data
        response = client.get(
            f"/api/get-repay-data?supply_token={supply_token}&wallet_id={wallet_id}"
        )
        mock_get_contract_address.assert_called_once_with(wallet_id)
        mock_get_position_id.assert_called_once_with(wallet_id)
        mock_get_repay_data.assert_called_once_with(supply_token)
        expected_response = {
            **mock_repay_data,
            "contract_address": "mock_contract_address",
            "position_id": "123",
        }
        assert response.status_code == 200
        assert response.json() == expected_response


@pytest.mark.anyio
async def test_get_repay_data_missing_wallet_id(client: AsyncClient) -> None:
    """
    Test for missing wallet ID when attempting to retrieve repayment data, which should return a 404 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    supply_token = "valid_supply_token"
    wallet_id = ""
    with (
        patch(
            "web_app.contract_tools.mixins.deposit.DepositMixin.get_repay_data"
        ) as mock_get_repay_data,
        patch(
            "web_app.db.crud.PositionDBConnector.get_contract_address_by_wallet_id"
        ) as mock_get_contract_address,
        patch(
            "web_app.db.crud.PositionDBConnector.get_position_id_by_wallet_id"
        ) as mock_get_position_id,
    ):
        mock_get_repay_data.return_value = None
        mock_get_contract_address.side_effect = None
        mock_get_position_id.side_effect = None
        response = client.get(
            f"/api/get-repay-data?supply_token={supply_token}&wallet_id={wallet_id}"
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "Wallet not found"}


# Test cases for /api/create_position_with_transaction_data
@pytest.mark.anyio
async def test_create_position_success(client: AsyncClient) -> None:
    """
    Test for successfully creating a position with valid form data.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    form_data = {
        "wallet_id": "valid_wallet_id",
        "token_symbol": "ETH",
        "amount": "1000",
        "multiplier": 2,
    }
    mock_position = Mock()
    mock_position.id = 123
    mock_deposit_data = {
        "caller": "mock_caller",
        "pool_price": 100,
        "pool_key": {
            "token0": "mock_token0",
            "token1": "mock_token1",
            "fee": "mock_fee",
            "tick_spacing": "mock_tick_spacing",
            "extension": "mock_extension",
        },
        "deposit_data": {
            "token": "mock_token",
            "amount": "mock_amount",
            "multiplier": "mock_multiplier",
        },
        "contract_address": "mock_contract_address",
        "position_id": "123",
    }

    with (
        patch(
            "web_app.db.crud.PositionDBConnector.create_position"
        ) as mock_create_position,
        patch(
            "web_app.contract_tools.mixins.deposit.DepositMixin.get_transaction_data"
        ) as mock_get_transaction_data,
        patch(
            "web_app.db.crud.PositionDBConnector.get_contract_address_by_wallet_id"
        ) as mock_get_contract_address,
    ):
        mock_create_position.return_value = mock_position
        mock_get_transaction_data.return_value = mock_deposit_data
        mock_get_contract_address.return_value = "mock_contract_address"
        response = client.post("/api/create-position", json=form_data)
        assert response.status_code == 200
        print(response.json())
        expected_response = {
            "contract_address": "mock_contract_address",
            "position_id": "123",
            "caller": "mock_caller",
            "pool_price": 100,
            "pool_key": {
                "token0": "mock_token0",
                "token1": "mock_token1",
                "fee": "mock_fee",
                "tick_spacing": "mock_tick_spacing",
                "extension": "mock_extension",
            },
            "deposit_data": {
                "token": "mock_token",
                "amount": "mock_amount",
                "multiplier": "mock_multiplier",
            },
        }
        assert response.json() == expected_response


@pytest.mark.anyio
async def test_create_position_invalid(client: AsyncClient) -> None:
    """
    Test for attempting to create a position with invalid input data, which should return a 422 error.

    Args:
        client (AsyncClient): The test client for the FastAPI application.

    Returns:
        None
    """
    response = client.post(
        "/api/create-position",
        json={"wallet_id": None, "token_symbol": "ETH", "amount": 100, "multiplier": 2},
    )
    assert response.status_code == 422
    assert "detail" in response.json()
