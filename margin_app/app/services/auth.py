"""
This module contains authentication related services.
"""
from datetime import datetime, timedelta, timezone
import os
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from app.crud.admin import admin_crud
from app.core.config import settings
from app.models.admin import Admin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(email: str, expires_delta: timedelta | None = None):
    """
    Generates auth jwt token for a given wallet ID

    Parameters:
    - wallet_id: str, the wallet ID of the user

    Returns:
    - str: The encoded JWT as a string
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(
        to_encode,
        os.environ.get("SECRET_KEY"),
        algorithm=settings.algorithm)


async def get_current_user(token: str) -> Admin:
    """
    Retrieves the current user based on the provided JWT token.

    Parameters:
    - token (str): The JWT token used for authentication.

    Returns:
    - User: The User object corresponding to the wallet ID extracted from the token.

    Raises:
    - Exception("Invalid jwt"): if jwt is invalid
    - Exception("User not found"): if jwt correct but user doesn't exists
    - Exception("jwt expired"): if jwt expired
    """

    try:
        payload = jwt.decode(
            token, os.environ.get("SECRET_KEY"), algorithms=[settings.algorithm]
        )
        email = payload.get("sub")
        if email is None:
            raise Exception("Invalid jwt")
        user = await admin_crud.get_object_by_field(field="email", value=email)
        if user is None:
            raise Exception("User not found")
        return user
    except InvalidTokenError as e:
        raise Exception("jwt expired") from e


def verify_password(plain_password, hashed_password) -> bool:
    """
    Verify that a plain text password matches a hashed password.

    :param plain_password: str - The plain password to be verified.
    :param hashed_password: str - The hashed password against which the plain
     one will be verified.

    :return: bool - True if the plain password matches the hashed password,
     False if not.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    """
    Hashes the provided password according to the specified hashing context.

    :param password: str - The password to be hashed.

    :return: str - The hashed password.
    """
    return pwd_context.hash(password)
