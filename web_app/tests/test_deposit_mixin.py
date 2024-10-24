import pytest

from web_app.contract_tools.mixins.deposit import DepositMixin


class TestDepositMixin:
    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "deposit_token, amount, multiplier, wallet_id, borrowing_token",
        [
            (
                "STRK",
                "10",
                2,
                "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
                "STRK",
            ),
        ],
    )
    async def test_get_transaction_data(
        self,
        deposit_token: str,
        amount: str,
        multiplier: int,
        wallet_id: str,
        borrowing_token: str,
    ) -> None: ...

    @pytest.mark.asyncio
    @pytest.mark.parametrize(
        "supply_token",
        [
            ("STRK",),
        ],
    )
    async def test_get_repay_data(self, supply_token: str) -> None: ...
