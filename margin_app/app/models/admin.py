"""
Admin model definitions for the application.
"""

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from .base import BaseModel  

class Admin(BaseModel):
    """
    Represents an administrative user with elevated privileges.

    Attributes:
        email (str): The unique email address of the admin.
        name (str): The full name of the admin.
        is_super_admin (bool): Indicates whether the admin has super admin privileges.
        password (str): The hashed password of the admin (to be stored as a hashed value in the future).
    """
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        comment="The unique email address of the admin."
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="The full name of the admin."
    )
    # Break the long line or disable the warning if needed.
    is_super_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Indicates if the admin has super admin privileges."  # pylint: disable=line-too-long
    )
    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="The hashed password of the admin."
    )
