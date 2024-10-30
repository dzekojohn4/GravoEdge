"""
Module for claiming unclaimed airdrops from the AirDropDBConnector
and updating the database when a claim is successful.
"""

import logging
import asyncio
from typing import List

from web_app.db.crud import AirDropDBConnector
from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.contract_tools.airdrop import ZkLendAirdrop

logger = logging.getLogger(__name__)
##1. fetch all airdops from AirDropDBConnector.get_all_unclaimed()
class AirdropClaimer:
    """
    Handles the process of claiming unclaimed airdrops and updating the database.
    """
    def __init__(self):
        """
        Initializes the AirdropClaimer with database and Starknet client instances.
        """
        self.db_connector = AirDropDBConnector()
        self.starknet_clinet = StarknetClient()
        self.zk_lend_airdrop = ZkLendAirdrop()

    ##2. create a function to claim airdrops using Starknetclient
    async def claim_airdrops(self) -> None:
        """
        Retrieves unclaimed airdrops, attempts to claim them on the Starknet blockchain,
        and updates the database if the claim is successful.
        """
        unclaimed_airdrops = self.db_connector.get_all_unclaimed()
        for airdrop in unclaimed_airdrops:
            try:
                # get user address and proof for claim
                user_contract_address = airdrop.user.contract_address
                proof = self.zk_lend_airdrop.get_contract_airdrop(user_contract_address)

                # accept claim
                claim_succesful = await self._claim_airdrop(user_contract_address, proof)

                if claim_succesful:
                    self.db_connector.save_claim_data(airdrop.id, airdrop.amount)
                    logger.info("Airdrop %s claimed succesfully.", airdrop.id)
            except Exception as e:
                logger.error("Error claiming airdrop %s: %s", airdrop.id, e)

    async def _claim_airdrop(self, contract_address: str, proof: List[int]) -> bool:
        """
        Claims a single airdrop by making a contract call on the Starknet blockchain.
        """
        calldata = [100] + proof
        try:
            # Starknet contract call
            await self.starknet_client._func_call(
                addr=self.starknet_client._convert_address(contract_address),
                selector="claim",
                calldata=calldata
            )
            return True
        except Exception as e:
            logger.error("Claim failed for address %s: %s", contract_address, e)
            return False
        
# Execute claim
if __name__ == "__main__":
    airdrop_claimer = AirdropClaimer()
    asyncio.run(airdrop_claimer.claim_airdrops())