from typing import Dict

from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.contract_tools.constants import SPOTNET_CORE_ADDRESS, TokenParams

CLIENT = StarknetClient()


class DashboardMixin:
    """
    Mixin class for dashboard related methods.
    """

    @classmethod
    async def get_wallet_balances(cls, holder_address: str) -> Dict[str, str]:
        """
        Get the wallet balances for the given holder address.
        :param holder_address: holder address
        :return: Returns the wallet balances for the given holder address.
        """
        wallet_balances = {}

        for token in TokenParams.tokens():
            try:
                balance = await CLIENT.get_balance(
                    token_addr=token.address,
                    holder_addr=holder_address,
                    decimals=token.decimals,
                )
                wallet_balances[token.name] = balance
            except Exception as e:  # handle if contract not found in wallet
                print(f"Failed to get balance for {token.address} due to an error: {e}")

        return wallet_balances


class DepositMixin:

    @classmethod
    async def get_transaction_data(
        cls,
        deposit_token: str,
        amount: str,
        multiplier: int,
        wallet_id: str,
        borrowing_token: str,
    ) -> list[dict, dict]:
        """
        Get transaction data for the deposit.
        :param deposit_token: Deposit token
        :param amount: Amount to deposit
        :param multiplier: Multiplier
        :param wallet_id: Wallet ID
        :param borrowing_token: Borrowing token
        :return: approve_data and loop_liquidity_data
        """
        deposit_token_address = TokenParams.get_token_address(deposit_token)
        approve_data = {
            "to_address": int(deposit_token_address, 16),
            "spender": int(SPOTNET_CORE_ADDRESS, 16),
            "amount": amount,
        }
        loop_liquidity_data = await CLIENT.get_loop_liquidity_data(
            deposit_token_address, amount, multiplier, wallet_id, borrowing_token
        )
        return [approve_data, loop_liquidity_data]
