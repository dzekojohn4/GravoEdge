"""
Integration test for the PositionClose view.
"""

import asyncio
import logging
from datetime import datetime
from typing import Any, Dict

import pytest

from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.crud import AirDropDBConnector, PositionDBConnector, UserDBConnector
from web_app.db.models import Status
from web_app.test_integration.utils import with_temp_user

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

user_db = UserDBConnector()
airdrop = AirDropDBConnector()
position_db = PositionDBConnector()


class TestPositionClose:
    """
    Integration test for closing and managing positions.
    Steps:
    1. Create a position using `PositionDBConnector`.
    2. Verify the created position's attributes.
    3. Update position status to 'opened'.
    4. Close the position using `PositionDBConnector`.
    5. Validate the position's final status and attributes.
    """

    form_data_1: Dict[str, Any] = {
        "wallet_id": "GB7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y3",
        "token_symbol": "XLM",
        "amount": "2",
        "multiplier": 1,
    }

    form_data_2: Dict[str, Any] = {
        "wallet_id": "GC7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y4",
        "token_symbol": "USDC",
        "amount": "1",
        "multiplier": 1,
    }
    def test_close_position(self, form_data: Dict[str, Any]) -> None:
        """
        Args:
        form_data (Dict[str, Any]): Position data.
        Returns:
            None
        """
        wallet_id = form_data["wallet_id"]
        token_symbol = form_data["token_symbol"]
        amount = form_data["amount"]
        multiplier = form_data["multiplier"]

        with with_temp_user(wallet_id):
            # Create position
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=token_symbol,
                amount=amount,
                multiplier=multiplier,
            )
            # Open position
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            position_status = position_db.open_position(position.id, current_prices)
            assert (
                position_status == Status.OPENED
            ), "Position status should be 'opened' after updating"
            logger.info(
                f"Position {position.id} successfully opened with status '{position.status}'."
            )

            # Close position
            close_result = position_db.close_position(position.id)
            assert close_result, "Close operation should succeed."

            position = position_db.get_position_by_id(position.id)
            assert (
                position.status == Status.CLOSED
            ), "Position status should be 'closed' after close operation"
            assert position.closed_at is not None, "Position should have closed_at timestamp"
