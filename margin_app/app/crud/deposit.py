"""
This module provides CRUD operations for deposits.
"""

import uuid
import logging
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from app.models.deposit import Deposit  # Import the Deposit model
from app.crud.base import DBConnector  # Import DBConnector for database operations

logger = logging.getLogger(__name__)


class DepositCRUD(DBConnector):
    """
    Provides CRUD operations for managing deposits in the database.

    Methods:
    - create_deposit: Creates a new deposit record.
    - update_deposit: Updates an existing deposit entry.
    """

    async def create_deposit(self, user_id: uuid.UUID, amount: float) -> Deposit:
        """
        Creates a new deposit entry in the database.

        Args:
            user_id (uuid.UUID): The ID of the user making the deposit.
            amount (float): The deposit amount.

        Returns:
            Deposit: The created deposit object.
        """
        new_deposit = Deposit(user_id=user_id, amount=amount)

        try:
            return await self.write_to_db(new_deposit)
        except SQLAlchemyError as e:
            logger.error(f"Failed to create deposit: {e}")
            raise Exception("Could not create deposit") from e

    async def update_deposit(self, deposit_id: uuid.UUID, amount: float) -> Deposit:
        """
        Updates the deposit amount for a given deposit ID.

        Args:
            deposit_id (uuid.UUID): The ID of the deposit to update.
            amount (float): The new deposit amount.

        Returns:
            Deposit: The updated deposit object.

        Raises:
            Exception: If the deposit is not found or the update fails.
        """
        async with self.session() as db:
            deposit = await db.get(Deposit, deposit_id)
            if not deposit:
                raise Exception(f"Deposit with ID {deposit_id} not found.")

            deposit.amount = amount  # Update the deposit amount
            await db.commit()
            await db.refresh(deposit)  # Refresh to reflect changes in DB
            return deposit
