"""
Test suite for the DashboardMixin class in the web_app.contract_tools.mixins.dashboard module.
"""

import pytest
from unittest.mock import patch, AsyncMock
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.contract_tools.constants import TokenParams
from web_app.api.serializers.dashboard import ZkLendPositionResponse

@pytest.fixture
def mock_starknet_client():
    """Mock the StarkNet client."""
    with patch('web_app.contract_tools.mixins.dashboard.CLIENT') as mock:
        yield mock

@pytest.fixture
def mock_api_request():
    """Mock the API request class."""
    with patch('web_app.contract_tools.mixins.dashboard.APIRequest') as mock:
        yield mock


class TestDashboardMixin:
    """
    Test cases for the DashboardMixin class, focusing on the methods
    related to wallet balances, zkLend positions, and product extraction.
    """

    @pytest.mark.asyncio
    async def test_get_wallet_balances_success(self, mock_starknet_client):
        """
        Test successful retrieval of wallet balances.
        """
        # Mock the get_balance method with pre-defined token balances
        mock_starknet_client.get_balance = AsyncMock(side_effect=[100, 200, 300])

        # Mock token parameters
        mock_tokens = [
            TokenParams.ETH,
            TokenParams.STRK,
            TokenParams.USDC,
        ]
        with patch.object(TokenParams, "tokens", return_value=mock_tokens):
            # Act
            result = await DashboardMixin.get_wallet_balances("0xHolderAddress")

        # Assert
        assert result == {"ETH": 100, "STRK": 200, "USDC": 300}

    @pytest.mark.asyncio
    async def test_get_wallet_balances_error_handling(self, mock_starknet_client):
        """
        Test wallet balances retrieval with error handling.
        """
        # Mock the get_balance method to throw an exception for the second token
        mock_starknet_client.get_balance = AsyncMock(side_effect=[100, Exception("error"), 300])

        # Mock token parameters
        mock_tokens = [
            TokenParams.ETH,
            TokenParams.STRK,
            TokenParams.USDC,
        ]
        with patch.object(TokenParams, "tokens", return_value=mock_tokens):
            # Act
            result = await DashboardMixin.get_wallet_balances("0xHolderAddress")

        # Assert
        assert result == {"ETH": 100, "USDC": 300}  # Token STRK should be skipped due to error

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "contract_address, mock_response, expected_protocols",
        [
            (
                "0x123abc",
                {
                    "dapps": [
                        {
                            "protocol": "zkLend",
                            "products": [
                                {
                                    "type": "lending",
                                    "token": "ETH",
                                    "supplied": "1.5",
                                    "borrowed": "0.5",
                                    "protocol": "zkLend",
                                    "groups": {"1": {"healthRatio": "0.9"}},
                                    "name": "ETH Lending",
                                    "positions": [],
                                    "health_ratio": "0.9"
                                },
                                {
                                    "type": "lending",
                                    "token": "USDC",
                                    "supplied": "1000",
                                    "borrowed": "0",
                                    "protocol": "zkLend",
                                    "groups": {"1": {"healthRatio": "1.0"}},
                                    "name": "USDC Lending",
                                    "positions": [],
                                    "health_ratio": "1.0"
                                }
                            ]
                        }
                    ]
                },
                ["ETH Lending", "USDC Lending"]
            ),
            (
                "0x456def",
                {
                    "dapps": [
                        {
                            "protocol": "zkLend",
                            "products": [
                                {
                                    "type": "lending",
                                    "token": "BTC",
                                    "supplied": "0.2",
                                    "borrowed": "0.1",
                                    "protocol": "zkLend",
                                    "name": "BTC Lending",
                                    "positions": [],
                                    "groups": {"1": {"healthRatio": "0"}},
                                    "health_ratio": "0"
                                }
                            ]
                        }
                    ]
                },
                ["BTC Lending"]
            ),
        ]
    )
    async def test_get_zklend_position_success(
        self,
        contract_address,
        mock_response,
        expected_protocols,
        mock_api_request
    ):
        """
        Test successful retrieval of zkLend position with valid response.

        Args:
            contract_address: The contract address for the zkLend.
            mock_response: The mock response for the API call.
            expected_protocols: Expected product names from the response.
        """
        # Arrange
        api_instance = AsyncMock()
        api_instance.fetch.return_value = mock_response
        mock_api_request.return_value = api_instance

        # Act
        result = await DashboardMixin.get_zklend_position(contract_address)

        # Assert
        assert isinstance(result, ZkLendPositionResponse)
        assert len(result.products) == len(expected_protocols)
        
        # Check that each expected protocol name matches a product name
        for expected_name in expected_protocols:
            assert any(product.name == expected_name for product in result.products)

        # Additional check for health_ratio handling
        if contract_address == "0x123abc":
            assert result.products[0].health_ratio == "0.9"  # ETH
            assert result.products[1].health_ratio == "1.0"  # USDC
        elif contract_address == "0x456def":
            assert result.products[0].health_ratio == "0"  # BTC has "0" instead of None

    @pytest.mark.parametrize(
        "dapps, expected_length, expected_tokens",
        [
            (
                [
                    {
                        "protocol": "zkLend",
                        "products": [
                            {
                                "type": "lending",
                                "token": "ETH",
                                "supplied": "1.5",
                                "protocol": "zkLend",
                                "health_ratio": "1.0"
                            }
                        ]
                    },
                    {
                        "protocol": "zkLend"  # Missing products key
                    }
                ],
                1,
                ["ETH"]
            ),
            (
                [
                    {
                        "protocol": "zkLend",
                        "products": []  # Empty products list
                    },
                    {
                        "protocol": "zkLend",
                        "products": [
                            {
                                "type": "lending",
                                "token": "BTC",
                                "supplied": "0.5",
                                "protocol": "zkLend",
                                "health_ratio": "0.8"
                            }
                        ]
                    }
                ],
                1,
                ["BTC"]
            ),
        ]
    )
    def test_get_products_with_missing_products(self, dapps, expected_length, expected_tokens):
        """
        Test products extraction when some dapps are missing products.
        
        Args:
            dapps: List of dapp data.
            expected_length: Expected number of products extracted.
            expected_tokens: List of expected token names.
        """
        # Act
        result = DashboardMixin._get_products(dapps)

        # Assert
        assert len(result) == expected_length
        assert [product["token"] for product in result] == expected_tokens

    @pytest.mark.parametrize(
        "dapps, expected_length, expected_tokens",
        [
            (
                [
                    {
                        "protocol": "validProtocol1",
                        "products": [
                            {
                                "type": "lending",
                                "token": "ETH",
                                "supplied": "5",
                                "borrowed": "0",
                                "health_ratio": "1.0"
                            },
                            {
                                "type": "lending",
                                "token": "USDC",
                                "supplied": "100",
                                "borrowed": "0",
                                "health_ratio": "0.9"
                            },
                        ]
                    },
                    {
                        "protocol": "validProtocol2",
                        "products": [
                            {
                                "type": "lending",
                                "token": "BTC",
                                "supplied": "1",
                                "borrowed": "0.5",
                                "health_ratio": "0.8"
                            }
                        ]
                    }
                ],
                3,
                ["ETH", "USDC", "BTC"]
            ),
            (
                [
                    {
                        "protocol": "validProtocol3",
                        "products": []
                    },
                    {
                        "protocol": "validProtocol4",
                        "products": []
                    }
                ],
                0,
                []
            ),
            (
                [],
                0,
                []
            ),
        ]
    )
    def test_get_products_with_valid_dapps(self, dapps, expected_length, expected_tokens):
        """
        Test products extraction from valid dapps data.
        
        Args:
            dapps: List of dapp data.
            expected_length: Expected number of products extracted.
            expected_tokens: List of expected token names.
        """
        # Act
        result = DashboardMixin._get_products(dapps)

        # Assert
        assert len(result) == expected_length
        assert [product["token"] for product in result] == expected_tokens