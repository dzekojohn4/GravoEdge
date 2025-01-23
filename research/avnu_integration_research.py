"""
Research and Implementation Guide for Avnu Integration
================================================

Objective:
Replace the Ekubo functionality in the existing StarknetClient code with Avnu for performing USDC/ETH swaps and related
functionalities. Additional integration of Avnu's gasless service endpoints.

Three Key Features of Avnu
--------------
1. Best Execution and Broad Asset Access:
    AVNU is designed to offer traders and dApps the most competitive prices by providing access to a wide range of assets.
    It focuses on delivering optimal execution for swaps while maintaining an exceptional user experience.
2. Gas Fee Abstraction with Paymaster Service:
    AVNU's Paymaster service simplifies transactions by abstracting gas fees,
    enabling users to pay gas fees in any token or allowing developers to sponsor users' fees.
    This reduces friction and enhances usability by eliminating the need to handle native tokens for gas.
3. Advanced Tools for Traders and Developers:
    AVNU provides advanced features like Dollar-Cost Averaging (DCA) for strategic investing,
    real-time market data insights, and a comprehensive token list. For developers, AVNU offers robust resources,
    including guides, contracts, audits, and tools to facilitate seamless integration into their applications.


Replace Ekubo with Avnu, the following changes will be implemented

API Endpoints:
-----------------------
1. Gasless Service Status: GET https://starknet.api.avnu.fi/paymaster/v1/status
   Fetch the current status of the gasless service.

2. Check Account Compatibility: GET https://starknet.api.avnu.fi/paymaster/v1/accounts/{address}/compatible
   Check if an account is compatible with the gasless service.

3. Build Typed Data: POST https://starknet.api.avnu.fi/paymaster/v1/build-typed-data
   Build typed data from a list of calls for gasless execution.

4. Execute Calls: POST https://starknet.api.avnu.fi/paymaster/v1/execute
   Execute calls using the gasless service.

5. Swap Execution: POST https://starknet.api.avnu.fi/swap/v2/execute
   Execute the swap transaction using Avnu.
"""

import asyncio
import logging
import os
from decimal import Decimal
from typing import Any, Dict, List

from avnu_sdk import AvnuClient
import starknet_py.hash.selector
import starknet_py.net.client_models
from starknet_py.net.full_node_client import FullNodeClient

logger = logging.getLogger(__name__)

class StarknetClient:
    """
    A client to interact with the Starknet blockchain and Avnu's services.
    """

    def __init__(self):
        """
        Initializes the Starknet client with a given node URL and sets up the Avnu client.
        """
        node_url = os.getenv("STARKNET_NODE_URL") or "http://51.195.57.196:6060/v0_7"
        if not node_url:
            raise ValueError("STARKNET_NODE_URL environment variable is not set")

        self.client = FullNodeClient(node_url=node_url)
        self.avnu_client = AvnuClient(api_key=os.getenv("AVNU_API_KEY"))

    async def get_gasless_status(self) -> Dict[str, Any]:
        """
        Fetches the current status of the gasless service.

        :return: A dictionary containing the gasless service status.
        """
        try:
            status = await self.avnu_client.get("paymaster/v1/status")
            logger.info(f"Gasless service status: {status}")
            return status
        except Exception as e:
            logger.error(f"Error fetching gasless service status: {e}")
            raise

    async def check_account_compatibility(self, address: str) -> Dict[str, Any]:
        """
        Checks if an account is compatible with the gasless service.

        :param address: The account address to check.
        :return: A dictionary containing compatibility details.
        """
        try:
            compatibility = await self.avnu_client.get(f"paymaster/v1/accounts/{address}/compatible")
            logger.info(f"Account compatibility: {compatibility}")
            return compatibility
        except Exception as e:
            logger.error(f"Error checking account compatibility: {e}")
            raise

    async def build_typed_data(self, calls: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Builds typed data for gasless execution.

        :param calls: A list of calls to be executed.
        :return: A dictionary containing the typed data.
        """
        try:
            typed_data = await self.avnu_client.post("paymaster/v1/build-typed-data", json={"calls": calls})
            logger.info(f"Typed data built successfully: {typed_data}")
            return typed_data
        except Exception as e:
            logger.error(f"Error building typed data: {e}")
            raise

    async def execute_gasless_call(self, typed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes a gasless call using the typed data.

        :param typed_data: The typed data to execute.
        :return: A dictionary containing the execution result.
        """
        try:
            execution_result = await self.avnu_client.post("paymaster/v1/execute", json=typed_data)
            logger.info(f"Gasless call executed successfully: {execution_result}")
            return execution_result
        except Exception as e:
            logger.error(f"Error executing gasless call: {e}")
            raise

    async def execute_swap(self, token_in: str, token_out: str, amount: int) -> Dict[str, Any]:
        """
        Executes a token swap using Avnu.

        :param token_in: The input token address.
        :param token_out: The output token address.
        :param amount: The amount of the input token.
        :return: A dictionary containing swap details.
        """
        try:
            swap_result = await self.avnu_client.post(
                "swap/v2/execute",
                json={
                    "token_in_address": token_in,
                    "token_out_address": token_out,
                    "amount": amount,
                },
            )
            logger.info(f"Swap executed successfully: {swap_result}")
            return swap_result
        except Exception as e:
            logger.error(f"Error executing swap: {e}")
            raise

CLIENT = StarknetClient()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    token_in = "0xTokenInAddress"
    token_out = "0xTokenOutAddress"
    amount = 1000000
    wallet_address = "0xWalletAddress"

    try:
        # Check gasless service status
        gasless_status = loop.run_until_complete(CLIENT.get_gasless_status())
        print("Gasless Service Status:", gasless_status)

        # Check account compatibility
        compatibility = loop.run_until_complete(CLIENT.check_account_compatibility(wallet_address))
        print("Account Compatibility:", compatibility)

        # Execute a swap
        swap_result = loop.run_until_complete(CLIENT.execute_swap(token_in, token_out, amount))
        print("Swap Result:", swap_result)

    except Exception as e:
        print(f"Error: {e}")
