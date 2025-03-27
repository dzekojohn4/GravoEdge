"""
CRUD operations for Admin model
"""

from typing import Optional, List
from sqlalchemy import select

from app.services.auth import get_password_hash
from app.models.admin import Admin
from .base import DBConnector

class AdminCRUD(DBConnector):
    """
    AdminCRUD class for handling database operations for the Admin model.
    """

    async def get_by_email(self, email: str) -> Optional[Admin]:
        """
        Get admin by email.
        :param email: str
        :return: Optional[Admin]
        """
        return await self.get_object_by_field(Admin, "email", email)

    async def get_super_admins(self) -> List[Admin]:
        """
        Get all super admins.
        :return: List[Admin]
        """
        async with self.session() as db:
            result = await db.execute(
                select(Admin).where(Admin.is_super_admin.is_(True))
            )
            return list(result.scalars().all())

    async def get_all(
        self, limit: Optional[int] = None, offset: Optional[int] = None
    ) -> list[Admin]:
        """
        Retrieves all admins.
        :param limit: Optional[int] - max admins to be retrieved
        :param offset: Optional[int] - start retrieving at.
        :return: list[Admin]
        """
        return await self.get_objects(Admin, limit, offset)

    async def create_admin(
        self, email: str, name: str, password: str, is_super_admin: bool = False
    ) -> Admin:
        """
        Create a new admin in the database.
        :param email: str
        :param name: str
        :param password: str
        :param is_super_admin: bool
        :return: Admin
        """
        hashed_password = get_password_hash(password)
        new_admin = Admin(
            name=name,
            email=email,
            password=hashed_password,
            is_super_admin=is_super_admin
        )
        return await self.write_to_db(new_admin)

    async def update_admin(self, admin_id: int, **kwargs) -> Optional[Admin]:
        """
        Update an admin in the database.
        :param admin_id: int
        :param kwargs: dict - fields to update
        :return: Optional[Admin]
        """
        if "password" in kwargs:
            kwargs["password"] = get_password_hash(kwargs["password"])
        admin = await self.get_object_by_field(Admin, "id", admin_id)
        if not admin:
            return None
        for field, value in kwargs.items():
            setattr(admin, field, value)
        return await self.write_to_db(admin)

admin_crud = AdminCRUD()
