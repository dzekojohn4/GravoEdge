"""This module contains the LiquidationCRUD class for managing liquidations."""

from uuid import UUID
from decimal import Decimal

from app.crud.base import DBConnector
from app.models.liquidation import Liquidation

class LiquidationCRUD(DBConnector):
    """Handles database operations for liquidations."""

    async def liquidate_position(
        self, db, margin_position_id: UUID,
        bonus_amount: Decimal,
        bonus_token: str
    ) -> Liquidation:
        """
        Liquidates a position by creating a liquidation record in the database.

        Args:
            margin_position_id (UUID): The ID of the margin position.
            bonus_amount (Decimal): The amount of the bonus.
            bonus_token (str): The token used for the bonus.

        Returns:
            Liquidation: The created liquidation record.
        """
        liquidation_entry = Liquidation(
            margin_position_id=margin_position_id,
            bonus_amount=bonus_amount,
            bonus_token=bonus_token
        )
        # Use the provided `db` session to commit the entry
        db.add(liquidation_entry)
        await db.commit()
        await db.refresh(liquidation_entry)

        return liquidation_entry

liquidation_crud = LiquidationCRUD()

async def add_deposit(self, margin_position_id: UUID, amount: Decimal, token: str) -> None:
    """
    Adds a deposit entry linked to a margin position.

    Args:
        margin_position_id (UUID): The ID of the margin position.
        amount (Decimal): The deposit amount.
        token (str): The token type.
    """
    deposit_entry = Liquidation(
        margin_position_id=margin_position_id,
        bonus_amount=amount,
        bonus_token=token
    )
    await self.write_to_db(deposit_entry)
