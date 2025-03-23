"""
JWT auth
"""

from typing import Annotated
from datetime import datetime, timedelta, timezone
import os
import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from dotenv import load_dotenv

from app.models.user import User
from app.crud.user import user_crud

load_dotenv()

ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(wallet_id: str, expires_delta: timedelta | None = None):
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
    to_encode = {"sub": wallet_id, "exp": expire}
    return jwt.encode(to_encode, os.environ.get("SECRET_KEY"), algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
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
            token, os.environ.get("SECRET_KEY"), algorithms=[ALGORITHM]
        )
        wallet_id = payload.get("sub")
        if wallet_id is None:
            raise Exception("Invalid jwt")
        user = await user_crud.get_object_by_field(field="wallet_id", value=wallet_id)
        if user is None:
            raise Exception("User not found")
        return user
    except InvalidTokenError as e:
        raise Exception("jwt expired") from e
