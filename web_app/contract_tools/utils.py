from typing import Dict
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.blockchain_call import StarknetClient

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
        for token in TokenParams:
            token_address, decimals = token.value
            balance = await CLIENT.get_balance(
                token_addr=token_address, holder_addr=holder_address, decimals=decimals
            )
            wallet_balances[token.name] = balance
        return wallet_balances
