"""
Integration test for the PositionClose view.
"""

import asyncio
import logging

import pytest
from typing import Any

from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.crud import PositionDBConnector, UserDBConnector
from web_app.db.models import Status
from web_app.test_integration.utils import with_temp_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

position_db = PositionDBConnector()


class TestPositionClose:
    """Integration test for closing and managing positions."""

    @pytest.mark.parametrize("wallet_id,token_symbol,amount,multiplier", [
        ("GC7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Z4", "XLM", "2", 1),
        ("GD7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Z5", "USDC", "1", 1),
    ])
    def test_close_position(self, wallet_id, token_symbol, amount, multiplier):
        """Create, open, then close a position and verify final state."""
        with with_temp_user(wallet_id):
            position = position_db.create_position(
                wallet_id=wallet_id,
                token_symbol=token_symbol,
                amount=amount,
                multiplier=multiplier,
            )
            current_prices = asyncio.run(DashboardMixin.get_current_prices())
            if token_symbol not in current_prices:
                pytest.skip(f"Token price missing for {token_symbol} (API unavailable?)")
            position_status = position_db.open_position(position.id, current_prices)
            assert position_status == Status.OPENED, (
                "Position status should be 'opened' after updating"
            )

            close_result = position_db.close_position(position.id)
            assert close_result, "Close operation should succeed."

            position = position_db.get_position_by_id(position.id)
            assert position.status == Status.CLOSED, (
                "Position status should be 'closed' after close operation"
            )
            assert position.closed_at is not None, (
                "Position should have closed_at timestamp"
            )
