"""
Ekubo Flash Loan Research and Implementation Guide
================================================

This research document outlines how to implement flash loans on Ekubo AMM platform,
based on their documentation and implementation examples.

Key Concepts:
------------
1. Flash Accounting: Ekubo's internal token balance accounting system.
2. Free Flash Loans: No fees for borrowing within same transaction.
3. Atomic Execution: All operations must complete in single transaction.

Implementation Flow:
------------------

API Endpoints(https://mainnet-api.ekubo.org/openapi.json) and Data Structures
"""

from dataclasses import dataclass
from typing import List, Dict
from decimal import Decimal
import httpx

@dataclass
class PoolKey:
    """Ekubo pool identification structure"""
    token0: str
    token1: str
    fee: int
    tick_spacing: int
    extension: str

@dataclass
class SwapRoute:
    """Structure for defining swap path"""
    pool_key: PoolKey
    sqrt_ratio_limit: int
    skip_ahead: int

@dataclass
class TokenAmount:
    """Token amount with direction"""
    token: str
    amount: int
    is_positive: bool

class EkuboFlashLoan:
    """
    Main class for handling Ekubo Flash Loan operations
    
    Key Features:
    - No upfront fees required
    - Must repay within same transaction
    - Uses flash accounting for internal balance management
    """

    def __init__(self, rpc_url: str, core_contract: str):
        self.rpc_url = rpc_url
        self.core_contract = core_contract

    async def get_profitable_route(self, input_token: str, amount: Decimal) -> List[SwapRoute]:
        """
        Find profitable arbitrage route using Ekubo API
        
        Example API call:
        GET https://mainnet-api.ekubo.org/quote/{amount}/{input_token}/{output_token}
        """
        base_url = "https://mainnet-api.ekubo.org/quote"
        amount_wei = int(amount * Decimal(10**18))

        async with httpx.AsyncClient() as client:
            # Get quote for potential arbitrage route
            response = await client.get(
                f"{base_url}/{amount_wei}/{input_token}/{input_token}"
            )
            quote_data = response.json()

            # Parse route from response
            return self._parse_route(quote_data['route'])

    def prepare_flash_loan_tx(
        self,
        route: List[SwapRoute],
        borrow_amount: TokenAmount
    ) -> Dict:
        """
        Prepare transaction for flash loan arbitrage
        
        Transaction flow:
        1. Borrow tokens via flash accounting (no explicit borrow call needed)
        2. Execute swaps through provided route
        3. Verify profit
        4. Repay loan automatically from swap proceeds
        """
        return {
            'contract_address': self.core_contract,
            'entry_point_selector': 'multi_route_swap',
            'calldata': [
                # Calldata format:
                # 1. Number of route nodes
                # 2. For each node: pool_key, sqrt_ratio_limit, skip_ahead
                # 3. Token amount with direction
                len(route),
                *self._encode_route(route),
                self._encode_amount(borrow_amount)
            ]
        }

    @staticmethod
    def _parse_route(route_data: List[Dict]) -> List[SwapRoute]:
        """Parse API response into SwapRoute objects"""
        return [
            SwapRoute(
                pool_key=PoolKey(
                    token0=node['pool_key']['token0'],
                    token1=node['pool_key']['token1'],
                    fee=node['pool_key']['fee'],
                    tick_spacing=node['pool_key']['tick_spacing'],
                    extension=node['pool_key']['extension']
                ),
                sqrt_ratio_limit=int(node['sqrt_ratio_limit'], 16),
                skip_ahead=int(node['skip_ahead'], 16)
            )
            for node in route_data
        ]

    @staticmethod
    def _encode_route(route: List[SwapRoute]) -> List[int]:
        """Encode route for transaction calldata"""
        calldata = []


        for node in route:
            # Encode pool key
            calldata.extend([
                int(node.pool_key.token0, 16),
                int(node.pool_key.token1, 16),
                node.pool_key.fee,
                node.pool_key.tick_spacing,
                int(node.pool_key.extension, 16),
                # Encode route parameters
                node.sqrt_ratio_limit,
                node.skip_ahead
            ])
        return calldata

    @staticmethod
    def _encode_amount(amount: TokenAmount) -> List[int]:
        """Encode token amount for transaction"""
        return [
            int(amount.token, 16),
            amount.amount,
            1 if amount.is_positive else 0
        ]




# get_transaction_data rework
async def get_transaction_data(
    _cls,
    deposit_token: str,
    amount: str,
    _wallet_id: str,
) -> dict:
    """
    Modified version using flash loans
    
    Flow:
    1. Calculate profitable route
    2. Prepare flash loan transaction
    3. Return transaction data
    """
    # Initialize flash loan handler
    ekubo = EkuboFlashLoan(
        rpc_url="",
        core_contract=""
    )

    # Convert amount to Decimal
    amount_decimal = Decimal(amount)

    # Get profitable route
    route = await ekubo.get_profitable_route(
        input_token=deposit_token,
        amount=amount_decimal
    )

    # Prepare borrow amount
    borrow_amount = TokenAmount(
        token=deposit_token,
        amount=int(amount_decimal * Decimal(10**18)),
        is_positive=True
    )

    # Get transaction data
    tx_data = ekubo.prepare_flash_loan_tx(
        route=route,
        borrow_amount=borrow_amount
    )

    return tx_data
