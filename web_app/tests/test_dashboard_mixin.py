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
    related to zkLend positions and product extraction.
    """
    
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
                                    "protocol": "zkLend"
                                },
                                {
                                    "type": "lending",
                                    "token": "USDC",
                                    "supplied": "1000",
                                    "borrowed": "0",
                                    "protocol": "zkLend"
                                }
                            ]
                        }
                    ]
                },
                ["ETH", "USDC"]
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
                                    "protocol": "zkLend"
                                }
                            ]
                        }
                    ]
                },
                ["BTC"]
            ),
            (
                "0x789xyz",
                {
                    "dapps": [
                        {
                            "protocol": "zkLend",
                            "products": []  # No products available
                        }
                    ]
                },
                []  # No protocols expected
            ),
            (
                "0xabc123",
                {
                    "dapps": [
                        {
                            "protocol": "zkLend",
                            "products": [
                                {
                                    "type": "lending",
                                    "token": "DAI",
                                    "supplied": "2000",
                                    "borrowed": "500",
                                    "protocol": "zkLend"
                                }
                            ]
                        }
                    ]
                },
                ["DAI"]
            )
        ]
    )
    async def test_get_zklend_position_success(self, contract_address, mock_response, 
                                               expected_protocols, mock_api_request):
        """
        Test successful retrieval of zkLend position with valid response.
        
        Args:
            contract_address: The contract address for the zkLend.
            mock_response: The mock response for the API call.
            expected_protocols: Expected token names from the response.
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
        for protocol in expected_protocols:
            assert any(product["token"] == protocol for product in result.products)

        # Verify contract address modification
        expected_address = TokenParams.add_underlying_address(contract_address)
        api_instance.fetch.assert_called_once_with(
            f"decomposition/{expected_address}",
            params={"chain": "starknet"}
        )

    @pytest.mark.parametrize(
        "dapps, expected_length, expected_tokens",
        [
            (
                [
                    {
                        "protocol": "zkLend",
                        # Missing products key
                    },
                    {
                        "protocol": "zkLend",
                        "products": [
                            {
                                "type": "lending",
                                "token": "ETH",
                                "amount": "1.5",
                                "protocol": "zkLend"
                            }
                        ]
                    }
                ],
                1,
                ["ETH"]
            ),
            (
                [
                    {
                        "protocol": "zkLend",
                        "products": [
                            {
                                "type": "lending",
                                "token": "USDC",
                                "supplied": "1000",
                                "protocol": "zkLend"
                            }
                        ]
                    },
                    {
                        "protocol": "zkLend"  # Missing products key
                    }
                ],
                1,
                ["USDC"]
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
                                "protocol": "zkLend"
                            }
                        ]
                    }
                ],
                1,
                ["BTC"]
            ),
            (
                [
                    {
                        "protocol": "zkLend",  # Missing products key
                    },
                    {
                        "protocol": "zkLend",  # Also missing products key
                    }
                ],
                0,
                []
            ),
            (
                [],  # Completely empty dapps list
                0,
                []
            ),
            (
                [
                    {
                        "protocol": "zkLend",
                        # Missing products key
                    },
                    {
                        "protocol": "anotherProtocol",
                        "products": [
                            {
                                "type": "lending",
                                "token": "ETH",
                                "supplied": "2.0",
                                "protocol": "anotherProtocol"
                            }
                        ]
                    }
                ],
                1,
                ["ETH"]
            ),
            (
                [
                    {
                        "protocol": "newProtocol",
                        "products": [
                            {
                                "type": "lending",
                                "token": "LINK",
                                "supplied": "3.0",
                                "protocol": "newProtocol"
                            }
                        ]
                    },
                    {
                        "protocol": "zkLend",
                        "products": []  # Empty products
                    }
                ],
                1,
                ["LINK"]
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
                            },
                            {
                                "type": "lending",
                                "token": "USDC",
                                "supplied": "100",
                                "borrowed": "0",
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
