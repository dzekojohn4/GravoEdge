"""This module contains the LiquidationCRUD class for managing liquidations."""

from app.crud.base import DBConnector
from app.models.liquidation import Liquidation

class LiquidationCRUD(DBConnector):
    """Handles database operations for liquidations."""

    async def liquidate_position(self, position_id: int) -> Liquidation:
        """
        Liquidates a position by creating a liquidation record in the database.

        :param position_id: ID of the position to be liquidated.
        :return: The created Liquidation record.
        """
        liquidation_entry = Liquidation(position_id=position_id)
        return await self.write_to_db(liquidation_entry)

liqudation_crud = LiquidationCRUD()
