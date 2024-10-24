import pytest

from starknet_py.contract import Contract
from starknet_py.net.full_node_client import FullNodeClient
from unittest.mock import AsyncMock, patch

from web_app.contract_tools.blockchain_call import StarknetClient

CLIENT = StarknetClient()


class TestStarknetClient:
    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "addr, expected_addr",
        [
            ("0x0", 0),
            ("0x1", 1),
            ("0x10", 16),
            ("0xABCDEF", 11259375),
            ("0xFFFFFFFF", 4294967295),
            ("0x100000000", 4294967296),
            ("0x0000000A", 10),
        ],
    )
    async def test__convert_address(self, addr: str, expected_addr: int) -> None:
        """
        Test cases for StarknetClient._convert_address static method
        :param addr: str
        :param expected_addr: int
        :return: None
        """
        assert CLIENT._convert_address(addr) == expected_addr

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "token0, token1",
        [
            ("STRK", "STRK"),
            ("ETH", "ETH"),
            ("USDC", "USDC"),
            ("STRK", "ETH"),
            ("ETH", "USDC"),
            ("", ""),
            (None, None),
        ],
    )
    async def test__build_ekubo_pool_key(self, token0: str, token1: str) -> None:
        """
        Test cases for StarknetClient._build_ekubo_pool_key static method
        :param token0: str
        :param token1: str
        :return: None
        """
        token0, token1 = str(token0), str(token1)
        expected_data = {
            "token0": token0,
            "token1": token1,
            "fee": CLIENT.FEE,
            "tick_spacing": CLIENT.TICK_SPACING,
            "extension": 0,
        }
        assert CLIENT._build_ekubo_pool_key(token0, token1) == expected_data

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "addr, selector, calldata",
        [
            (0, "testCallback", [0]),
            (1, "djeck", list(range(10))),
            (3.13, "", []),
        ],
    )
    @patch.object(FullNodeClient, "call_contract", new_callable=AsyncMock)
    async def test__func_call(
        self,
        mock_call_contract: AsyncMock,
        addr: int,
        selector: str,
        calldata: list[int],
    ) -> None:
        """
        Test cases for StarknetClient._func_call method
        :param mock_call_contract: unittest.mock.AsyncMock
        :param addr: int
        :param selector: str
        :param calldata: list[int]
        :return: None
        """
        expected_response = {
            "addr": addr,
            "selector": selector,
            "calldata": calldata,
        }
        mock_call_contract.return_value = expected_response

        response = await CLIENT._func_call(addr, selector, calldata)

        mock_call_contract.assert_called_once()
        assert response == expected_response
