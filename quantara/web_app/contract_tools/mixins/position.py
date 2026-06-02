"""
Mixins for position related methods in the Stellar-based Quantara protocol.
"""

from web_app.contract_tools.blockchain_call import CLIENT


class PositionMixin:
    """
    Mixin for position related methods using Stellar/Soroban primitives.
    """

    @classmethod
    async def is_opened_position(cls, contract_address: str) -> bool:
        """
        Check if the position is opened.
        :param contract_address: Contract address or account ID
        :return: True if the position is opened, False otherwise
        """
        # In a full Soroban integration this would query the position contract.
        # For now, returns True if the contract is deployed on the network.
        try:
            return await CLIENT.is_contract_deployed(contract_address)
        except Exception:
            return False
