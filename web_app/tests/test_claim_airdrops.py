"""
Tests for the AirdropClaimer class, covering happy and negative paths.

Fixtures:
- mock_db_connector: Provides an AirDropDBConnector instance.
- mock_starknet_client: Provides an AirDropDBConnector instance.
- mock_zk_lend_airdrop: Provides an AirDropDBConnector instance.
- airdrop_claimer: Provides an AirDropDBConnector instance.

Test Cases:
- test_claim_airdrops_success: Test successful airdrop claiming process.
- test_claim_airdrops_connection_error: Test handling of connection errors during claim.
- test_claim_airdrops_database_error: Test handling of database errors during airdrop claiming.
- test_claim_airdrop_method_success: Test the internal _claim_airdrop for successful scenario.
- test_claim_airdrop_method_errors: Test the internal _claim_airdrop for error scenarios.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import pytest_asyncio
from requests.exceptions import ConnectionError, Timeout
from sqlalchemy.exc import SQLAlchemyError

from web_app.contract_tools.airdrop import ZkLendAirdrop
from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.db.crud import AirDropDBConnector
from web_app.tasks.claim_airdrops import AirdropClaimer


@pytest.fixture
def mock_db_connector():
    """Fixture to create a mock AirDropDBConnector."""
    return MagicMock(spec=AirDropDBConnector)


@pytest.fixture
def mock_starknet_client():
    """Fixture to create a mock StarknetClient."""
    return AsyncMock(spec=StarknetClient)


@pytest.fixture
def mock_zk_lend_airdrop():
    """Fixture to create a mock ZkLendAirdrop."""
    return MagicMock(spec=ZkLendAirdrop)


@pytest_asyncio.fixture
async def airdrop_claimer(
    mock_db_connector, mock_starknet_client, mock_zk_lend_airdrop
):
    """Fixture to create an AirdropClaimer with mocked dependencies."""
    with (
        patch(
            "web_app.contract_tools.airdrop.ZkLendAirdrop",
            return_value=mock_zk_lend_airdrop,
        ),
        patch(
            "web_app.contract_tools.blockchain_call.StarknetClient",
            return_value=mock_starknet_client,
        ),
        patch("web_app.db.crud.AirDropDBConnector", return_value=mock_db_connector),
    ):
        claimer = AirdropClaimer()
        return claimer


@pytest.mark.asyncio
async def test_claim_airdrops_success(
    airdrop_claimer, mock_db_connector, mock_starknet_client, mock_zk_lend_airdrop
):
    """Test successful airdrop claiming process."""
    # Prepare mock data
    mock_unclaimed_airdrop = MagicMock()
    mock_unclaimed_airdrop.user.contract_address = "0x123"
    mock_unclaimed_airdrop.id = 1
    mock_unclaimed_airdrop.amount = 100

    # Setup mock behaviors
    mock_db_connector.get_all_unclaimed.return_value = [mock_unclaimed_airdrop]
    mock_zk_lend_airdrop.get_contract_airdrop.return_value = ["proof1", "proof2"]
    mock_starknet_client.claim_airdrop.return_value = True

    # Run the method
    await airdrop_claimer.claim_airdrops()

    # Assert expected calls
    mock_zk_lend_airdrop.get_contract_airdrop.assert_called_once_with("0x123")
    mock_starknet_client.claim_airdrop.assert_called_once_with(
        "0x123", ["proof1", "proof2"]
    )
    mock_db_connector.save_claim_data.assert_called_once_with(1, 100)


@pytest.mark.asyncio
async def test_claim_airdrops_connection_error(
    airdrop_claimer, mock_db_connector, mock_starknet_client, mock_zk_lend_airdrop
):
    """Test handling of connection errors during airdrop claiming."""
    # Prepare mock data
    mock_unclaimed_airdrop = MagicMock()
    mock_unclaimed_airdrop.user.contract_address = "0x123"
    mock_unclaimed_airdrop.id = 1

    # Setup mock behaviors
    mock_db_connector.get_all_unclaimed.return_value = [mock_unclaimed_airdrop]
    mock_zk_lend_airdrop.get_contract_airdrop.return_value = ["proof1", "proof2"]
    mock_starknet_client.claim_airdrop.side_effect = ConnectionError("Network error")

    # Run the method
    await airdrop_claimer.claim_airdrops()

    # Assert expected calls
    mock_starknet_client.claim_airdrop.assert_called_once_with(
        "0x123", ["proof1", "proof2"]
    )
    mock_db_connector.save_claim_data.assert_not_called()


@pytest.mark.asyncio
async def test_claim_airdrops_database_error(
    airdrop_claimer, mock_db_connector, mock_starknet_client, mock_zk_lend_airdrop
):
    """Test handling of database errors during airdrop claiming."""
    # Prepare mock data
    mock_unclaimed_airdrop = MagicMock()
    mock_unclaimed_airdrop.user.contract_address = "0x123"
    mock_unclaimed_airdrop.id = 1
    mock_unclaimed_airdrop.amount = 100

    # Setup mock behaviors
    mock_db_connector.get_all_unclaimed.return_value = [mock_unclaimed_airdrop]
    mock_zk_lend_airdrop.get_contract_airdrop.return_value = ["proof1", "proof2"]
    mock_starknet_client.claim_airdrop.return_value = True
    mock_db_connector.save_claim_data.side_effect = SQLAlchemyError("Database error")

    # Run the method
    await airdrop_claimer.claim_airdrops()

    # Assert expected calls
    mock_starknet_client.claim_airdrop.assert_called_once_with(
        "0x123", ["proof1", "proof2"]
    )
    mock_db_connector.save_claim_data.assert_called_once_with(1, 100)


@pytest.mark.asyncio
async def test_claim_airdrop_method_success(airdrop_claimer, mock_starknet_client):
    """Test the internal _claim_airdrop method for successful scenario."""
    mock_starknet_client.claim_airdrop.return_value = True

    result = await airdrop_claimer._claim_airdrop("0x123", ["proof1", "proof2"])

    assert result is True
    mock_starknet_client.claim_airdrop.assert_called_once_with(
        "0x123", ["proof1", "proof2"]
    )


@pytest.mark.asyncio
async def test_claim_airdrop_method_errors(airdrop_claimer, mock_starknet_client):
    """Test the internal _claim_airdrop method for different error scenarios."""
    error_scenarios = [
        (ConnectionError("Network error"), False),
        (Timeout("Request timed out"), False),
        (ValueError("Invalid data"), False),
        (Exception("Unexpected error"), False),
    ]

    for error, expected_result in error_scenarios:
        mock_starknet_client.claim_airdrop.side_effect = error

        result = await airdrop_claimer._claim_airdrop("0x123", ["proof1", "proof2"])

        assert result == expected_result
