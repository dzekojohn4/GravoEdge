"""
This module defines the contract tools for the airdrop data.
"""

from typing import List
from web_app.api.serializers.airdrop import AirdropItem, AirdropResponseModel
from web_app.contract_tools.api_request import APIRequest
from web_app.contract_tools.constants import TokenParams


class AirdropFetcher:
    """
    A class to fetch and validate airdrop data for a specified contract.
    """

    # Default endpoint – replace with the actual protocol airdrop API
    REWARD_API_ENDPOINT = "https://app.zklend.com/api/reward/all/"

    def __init__(self):
        """
        Initializes the AirdropFetcher with an APIRequest instance.
        """
        self.api = APIRequest(base_url=self.REWARD_API_ENDPOINT)

    async def get_contract_airdrop(self, contract_id: str) -> AirdropResponseModel:
        """
        Fetches all available airdrops for a specific contract.

        Args:
            contract_id: The ID of the contract for which to fetch airdrop data.
        Returns:
            AirdropResponseModel: A validated list of airdrop items.
        Raises:
            ValueError: If contract_id is None
        """
        if contract_id is None:
            raise ValueError("Contract ID cannot be None")

        underlying_contract_id = contract_id
        response = await self.api.fetch(underlying_contract_id)
        return self._validate_response(response)

    @staticmethod
    def _validate_response(data: List[dict]) -> AirdropResponseModel:
        """
        Validates and formats the response data.

        Args:
            data: Raw response data from the API.
        Returns:
            AirdropResponseModel: Structured and validated airdrop data.
        """
        validated_items = []
        for item in data:
            validated_item = AirdropItem(
                amount=item["amount"],
                proof=item["proof"],
                is_claimed=item["is_claimed"],
                recipient=item["recipient"],
            )
            validated_items.append(validated_item)
        return AirdropResponseModel(airdrops=validated_items)
