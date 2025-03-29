"""
Security utilities for the application.
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """
    Hashes the provided password according to the specified hashing context.

    :param password: str - The password to be hashed.

    :return: str - The hashed password.
    """
    return pwd_context.hash(password) 