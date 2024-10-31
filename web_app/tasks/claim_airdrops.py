"""
Module for claiming unclaimed airdrops from the AirDropDBConnector
and updating the database when a claim is successful.
"""

import asyncio
import logging
from typing import List

from requests.exceptions import ConnectionError, Timeout
from sqlalchemy.exc import SQLAlchemyError
from web_app.contract_tools.airdrop import ZkLendAirdrop
from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.db.crud import AirDropDBConnector

logger = logging.getLogger(__name__)


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

    async def claim_airdrops(self) -> None:
        """
        Retrieves unclaimed airdrops, attempts to claim them on the Starknet blockchain,
        and updates the database if the claim is successful.
        """
        unclaimed_airdrops = self.db_connector.get_all_unclaimed()
        for airdrop in unclaimed_airdrops:
            try:
                user_contract_address = airdrop.user.contract_address
                proof = self.zk_lend_airdrop.get_contract_airdrop(user_contract_address)

                claim_succesful = await self._claim_airdrop(
                    user_contract_address, proof
                )

                if claim_succesful:
                    self.db_connector.save_claim_data(airdrop.id, airdrop.amount)
                    logger.info("Airdrop %s claimed succesfully.", airdrop.id)
            except ValueError as ve:
                logger.error("Invalid data for airdrop %s: %s", airdrop.id, ve)
            except SQLAlchemyError as db_err:
                logger.error(
                    "Database error while updating claim data for airdrop %s: %s",
                    airdrop.id,
                    db_err,
                )
            except ConnectionError as ce:
                logger.error(
                    "Network connection error during claim for airdrop %s: %s",
                    airdrop.id,
                    ce,
                )
            except Timeout as te:
                logger.error("Timeout during claim for airdrop %s: %s", airdrop.id, te)
            except Exception as e:
                logger.error("Unexpected error claiming airdrop %s: %s", airdrop.id, e)

    async def _claim_airdrop(self, contract_address: str, proof: List[str]) -> bool:
        """
        Claims a single airdrop by making a contract call on the Starknet blockchain.
        """
        calldata = [] + proof
        try:
            await self.starknet_client._func_call(
                addr=self.starknet_client._convert_address(contract_address),
                selector="claim",
                calldata=calldata,
            )
            return True
        except ConnectionError as ce:
            logger.error(
                "Network connection failed for address %s: %s", contract_address, ce
            )
            return False
        except Timeout as te:
            logger.error(
                "Timeout during claim for address %s: %s", contract_address, te
            )
            return False
        except ValueError as ve:
            logger.error(
                "Invalid data format for calldata during claim for address %s: %s",
                contract_address,
                ve,
            )
            return False
        except Exception as e:
            logger.error(
                "Unexpected error claiming address %s: %s", contract_address, e
            )
            return False


if __name__ == "__main__":
    airdrop_claimer = AirdropClaimer()
    asyncio.run(airdrop_claimer.claim_airdrops())
