"""
This module contains Pydantic schemas for admin.
"""
from uuid import UUID

from typing import Optional
from pydantic import BaseModel, EmailStr


class AdminBase(BaseModel):
    """
    Admin base model
    """

    name: str
    email: EmailStr


class AdminRequest(AdminBase):
    """
    Admin request model
    """

    password: str


class AdminResetPassword(AdminBase):
    """
    Admin reset password model
    """
    name: Optional[str] = None
    old_password: str
    new_password: str


class AdminResponse(AdminBase):
    """
    Admin response model
    """

    id: UUID
