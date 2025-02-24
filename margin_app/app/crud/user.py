"""
CRUD operations for User model
"""

import asyncio
import uuid
from typing import Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.sql import text
from sqlalchemy.exc import IntegrityError
from decimal import Decimal
import pytest

from app.models.deposit import Deposit
from app.models.margin_position import MarginPosition
from app.models.user import User

from .base import DBConnector


class UserCRUD(DBConnector):
    """
    UserCRUD class for handling database operations for the User model.
    """

    async def test_connection(self):
        """
        Test the database connection.
        :return
        """
        async with self.session() as session:
            result = await session.execute(text("SELECT version()"))
            return f"PostgreSQL version: {result.scalar()}"
        

    async def create_user(self, wallet_id: str) -> User:
        """
        Create a new user in the database.
        :param wallet_id: str
        :return: User
        """

        if not wallet_id:
            raise ValueError("wallet_id cannot be empty")
        
        new_user = User(wallet_id=wallet_id)
        async with self.session() as session:
            try:
                session.add(new_user)
                await session.commit()
                await session.refresh(new_user)
                return new_user
            except IntegrityError as e:
                await session.rollback()
                if "unique constraint" in str(e).lower():
                    raise ValueError(f"Key (wallet_id)=({wallet_id}) already exists") from e
                raise

    async def get_user(self, user_id: UUID, **kwargs) -> Optional[User]:
        """
        Get a user from the database.
        :param user_id: UUID
        :return: User
        """
        async with self.session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            return result.scalar_one_or_none()    

    async def update_user(self, user_id: UUID, **kwargs) -> Optional[User]:
        """
        Update an existing user in the database.
        :param user_id: UUID
        :return: User
        """

        async with self.session() as session:
            user = await session.get(User, user_id)
            if not user:
                return None
            for key, value in kwargs.items():
                setattr(user, key, value)
            await session.commit()
            await session.refresh(user)
            return user

    async def delete_user(self, user_id: UUID) -> None:
        """
        Delete a user from the database.
        :param user_id: UUID
        :return: None
        """
        async with self.session() as session:
            user = await session.get(User, user_id)
            if not user:
                raise ValueError(f"User {user_id} does not exist.")
            session.delete(user)
            await session.commit()

    async def add_deposit(
        self, user_id: UUID, amount: Decimal, 
        token: str, transaction_id: str
    ) -> Deposit:
        """
        Add a deposit to a user's account.
        :param user_id: UUID
        :param amount: Decimal
        :param token str
        :param transaction_id str
        :return: Deposit
        """
        if amount <= Decimal("0.00"):
            raise ValueError("Deposit amount must be greater than zero.")

        if not await self.get_user(user_id):
            raise ValueError(f"User {user_id} does not exist.")
        
        new_deposit = Deposit(
            user_id=user_id, amount=amount, 
            token=token, transaction_id=transaction_id
        )
        async with self.session() as session:
            session.add(new_deposit)
            await session.commit()
            await session.refresh(new_deposit)
            return new_deposit
   
    async def add_margin_position(
        self, user_id: UUID, 
        borrowed_amount: Decimal,
        multiplier: int,
        transaction_id: str
    ) -> MarginPosition:
        """
        Add a margin position to a user's account.
        :param user_id: UUID
        :param borrowed_amount: Decimal
        :param multiplier: int
        :param transaction_id str
        :return: MarginPosition
        """
        if borrowed_amount <= Decimal("0.00"):
            raise ValueError("Borrowed amount must be greater than zero.")
        
        if multiplier <= 0:
            raise ValueError("Multiplier must be greater than zero.")

        if not await self.get_object(User, user_id):
            raise ValueError(f"User {user_id} does not exist.")
        new_margin_position = MarginPosition(
            user_id=user_id,
            borrowed_amount=borrowed_amount,
            multiplier=multiplier,
            transaction_id=transaction_id
        )
        async with self.session() as session:
            session.add(new_margin_position)
            await session.commit()
            await session.refresh(new_margin_position)
            return new_margin_position

user_crud = UserCRUD()
