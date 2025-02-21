"""This module contains the LiquidationCRUD class for managing liquidations."""

from app.crud.base import DBConnector
from app.models.liquidation import Liquidation
from sqlalchemy.orm import Session

class LiquidationCRUD(DBConnector):
    """Handles database operations for liquidations."""

    def liquidate_position(self, db: Session, position_id: int):
        """Liquidates a position based on the given position ID."""
        liquidation_entry = Liquidation(position_id=position_id)
        db.add(liquidation_entry)
        db.commit()
        db.refresh(liquidation_entry)
        return liquidation_entry
