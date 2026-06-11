"""
Module: Position Creation Tests
This module contains integration tests for the creation and management
of user positions within the webapp.
"""

import asyncio
import logging

import pytest
from typing import Any

from web_app.db.crud import PositionDBConnector, AirDropDBConnector
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.models import Status
from web_app.test_integration.utils import with_temp_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

position_db = PositionDBConnector()
airdrop = AirDropDBConnector()


class TestPositionCreation:
    """Integration test for creating and managing positions."""

    @pytest.mark.parametrize("wallet_id,token_symbol,amount,multiplier", [
        ("GA7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2", "XLM", "2", 1),
        ("GB7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y3", "USDC", "5", 1),
    ])
    def test_create_position(self, wallet_id, token_symbol, amount, multiplier):
        """Create a position, open it, and verify attributes."""
        with with_temp_user(wallet_id):
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=token_symbol,
                amount=amount,
                multiplier=multiplier,
            )
            assert position.status == Status.PENDING, (
                "Position status should be 'pending' upon creation"
            )
            assert position.is_protection is False, (
                "Position should not have protection by default"
            )

            logger.info(
                "Position %s created successfully with status '%s'.",
                position.id,
                position.status,
            )

            # Open position
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            if token_symbol not in current_prices:
                pytest.skip(f"Token price missing for {token_symbol} (API unavailable?)")
            position_status = position_db.open_position(position.id, current_prices)
            assert position_status == Status.OPENED, (
                "Position status should be 'opened' after updating"
            )
            logger.info("Position %s successfully opened.", position.id)
            # Verify position attributes after opening
            position = position_db.get_position_by_id(position.id)
            assert position is not None, "Position not found in database"
            assert position.status == Status.OPENED, "Position status should be 'opened'"
            assert position.start_price == current_prices[token_symbol], (
                "Start price should be the token price"
            )
            assert position.created_at is not None, (
                "Position should have a created_at timestamp"
            )
