"""
This module contains the UserPoolCRUD class, which provides
CRUD operations for the UserPool model.
"""

import uuid
import asyncio
from decimal import Decimal
from app.models.pool import UserPool
from app.crud.base import DBConnector


class UserPoolCRUD(DBConnector):
    """
    CRUD operations for UserPool model.
    """

    async def create_user_pool(self, user_id: uuid.UUID, pool_id: uuid.UUID, token: str, amount: Decimal):
        """
        Create a new user pool entry.

        Args:
            user_id (uuid.UUID): The ID of the user.
            pool_id (uuid.UUID): The ID of the pool.
            token (str): The token associated with the pool.
            amount (Decimal): The amount invested in the pool.

        Returns:
            UserPool: The newly created user pool entry.
        """
        async with self.session() as db:
            user_pool = UserPool(user_id=user_id, pool_id=pool_id, token=token, amount=amount)
            db.add(user_pool)
            await db.commit()
            await db.refresh(user_pool)
            return user_pool

    async def update_user_pool(self, user_pool_id: uuid.UUID, token: str = None, amount: Decimal = None):
        """
        Update user pool details.

        Args:
            user_pool_id (uuid.UUID): The ID of the user pool entry to update.
            token (str, optional): The new token value.
            amount (Decimal, optional): The new amount value.

        Returns:
            UserPool | None: The updated user pool entry, or None if not found.
        """
        async with self.session() as db:
            user_pool = await db.get(UserPool, user_pool_id)
            if not user_pool:
                return None  # Not found
            
            if token:
                user_pool.token = token
            if amount:
                user_pool.amount = amount

            await db.commit()
            await db.refresh(user_pool)
            return user_pool


async def test_crud():
    """
    Test function to create and update a user pool entry.
    """
    db = UserPoolCRUD()
    
    user_pool = await db.create_user_pool(
        user_id=uuid.uuid4(), pool_id=uuid.uuid4(), token="TEST", amount=Decimal("100.50")
    )
    print("Created:", user_pool)

    updated_pool = await db.update_user_pool(user_pool.id, amount=Decimal("150.75"))
    print("Updated:", updated_pool)


if __name__ == "__main__":
    asyncio.run(test_crud())
