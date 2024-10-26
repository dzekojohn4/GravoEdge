import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from decimal import Decimal

from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.contract_tools.constants import TokenParams
from web_app.api.serializers.dashboard import ZkLendPositionResponse

@pytest.fixture
def mock_starknet_client():
    with patch('web_app.contract_tools.mixins.dashboard.CLIENT') as mock:
        yield mock

@pytest.fixture
def mock_api_request():
    with patch('web_app.contract_tools.mixins.dashboard.APIRequest') as mock:
        yield mock

class TestDashboardMixin:
    
    @pytest.mark.asyncio
    async def test_get_wallet_balances_success(self, mock_starknet_client):
        """
        Test successful retrieval of wallet balances for ETH and USDC tokens
        """
        # Arrange
        holder_address = "0x123456789abcdef"
        # Mock balance returns for ETH and USDC
        balance_returns = {
            TokenParams.ETH.address: "10500000000000000000",  # 10.5 ETH
            TokenParams.USDC.address: "1000000000",  # 1000 USDC (assuming 6 decimals)
        }
        
        async def mock_get_balance(token_addr, holder_addr, decimals):
            return balance_returns.get(token_addr, "0")

        mock_starknet_client.get_balance = AsyncMock(side_effect=mock_get_balance)

        # Act
        result = await DashboardMixin.get_wallet_balances(holder_address)

        # Assert
        assert isinstance(result, dict)
        assert len(result) == 2
        assert "ETH" in result
        assert "USDC" in result
        assert result["ETH"] == "10.5"
        assert result["USDC"] == "1000.0"

    @pytest.mark.asyncio
    async def test_get_wallet_balances_with_errors(self, mock_starknet_client):
        """
        Test wallet balances when some token queries fail
        """
        # Arrange
        holder_address = "0x123456789abcdef"
        
        async def mock_get_balance(token_addr, holder_addr, decimals):
            if token_addr == TokenParams.ETH.address:
                return "10500000000000000000"  # 10.5 ETH
            if token_addr == TokenParams.USDC.address:
                raise Exception("Contract interaction failed")
            return "0"

        mock_starknet_client.get_balance = AsyncMock(side_effect=mock_get_balance)

        # Act
        result = await DashboardMixin.get_wallet_balances(holder_address)

        # Assert
        assert isinstance(result, dict)
        assert result.get("ETH") == "10.5"
        assert "USDC" not in result  # Failed token should be omitted

    @pytest.mark.asyncio
    async def test_get_zklend_position_success(self, mock_api_request):
        """
        Test successful retrieval of zkLend position with valid response
        """
        # Arrange
        contract_address = "0x123abc"
        mock_response = {
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
        }

        api_instance = AsyncMock()
        api_instance.fetch.return_value = mock_response
        mock_api_request.return_value = api_instance

        # Act
        result = await DashboardMixin.get_zklend_position(contract_address)

        # Assert
        assert isinstance(result, ZkLendPositionResponse)
        assert len(result.products) == 2
        assert result.products[0]["protocol"] == "zkLend"
        
        # Verify contract address modification
        expected_address = TokenParams.add_underlying_address(contract_address)
        api_instance.fetch.assert_called_once_with(
            f"decomposition/{expected_address}",
            params={"chain": "starknet"}
        )

    @pytest.mark.asyncio
    async def test_get_zklend_position_empty_response(self, mock_api_request):
        """
        Test zkLend position handling when API returns empty response
        """
        # Arrange
        contract_address = "0x123abc"
        api_instance = AsyncMock()
        api_instance.fetch.return_value = {"dapps": []}
        mock_api_request.return_value = api_instance

        # Act
        result = await DashboardMixin.get_zklend_position(contract_address)

        # Assert
        assert isinstance(result, ZkLendPositionResponse)
        assert result.products == []

    def test_get_products_with_valid_dapps(self):
        """
        Test products extraction from valid dapps data
        """
        # Arrange
        dapps = [
            {
                "protocol": "zkLend",
                "products": [
                    {
                        "type": "lending",
                        "token": "ETH",
                        "supplied": "1.5",
                        "protocol": "zkLend"
                    },
                    {
                        "type": "lending",
                        "token": "USDC",
                        "supplied": "1000",
                        "protocol": "zkLend"
                    }
                ]
            }
        ]

        # Act
        result = DashboardMixin._get_products(dapps)

        # Assert
        assert len(result) == 2
        assert result[0]["token"] == "ETH"
        assert result[0]["protocol"] == "zkLend"
        assert result[1]["token"] == "USDC"
        assert result[1]["protocol"] == "zkLend"

    def test_get_products_with_empty_dapps(self):
        """
        Test products extraction with empty dapps list
        """
        # Arrange
        dapps = []

        # Act
        result = DashboardMixin._get_products(dapps)

        # Assert
        assert result == []

    def test_get_products_with_missing_products(self):
        """
        Test products extraction when some dapps are missing products
        """
        # Arrange
        dapps = [
            {
                "protocol": "zkLend"
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
        ]

        # Act
        result = DashboardMixin._get_products(dapps)

        # Assert
        assert len(result) == 1
        assert result[0]["token"] == "ETH"
        assert result[0]["protocol"] == "zkLend"

    @pytest.mark.asyncio
    async def test_get_wallet_balances_large_numbers(self, mock_starknet_client):
        """
        Test wallet balances handling of large numbers with correct decimals
        """
        # Arrange
        holder_address = "0x123456789abcdef"
        large_number = "1000000000000000000"  # 1 ETH in wei
        
        mock_starknet_client.get_balance = AsyncMock(return_value=large_number)

        with patch.object(TokenParams, 'tokens', return_value=[TokenParams.ETH]):
            # Act
            result = await DashboardMixin.get_wallet_balances(holder_address)
            
            # Assert
            assert isinstance(result, dict)
            assert "ETH" in result
            assert result["ETH"] == "1.0"  # Assuming the balance is converted to ETH