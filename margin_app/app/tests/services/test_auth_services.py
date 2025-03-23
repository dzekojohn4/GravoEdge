"""
Tests for services/auth.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch
import uuid
import os
import pytest
import jwt
from dotenv import load_dotenv

from app.services.auth import create_access_token, get_current_user
from app.crud.user import user_crud

load_dotenv()
ALGORITHM = "HS256"


def test_create_access_token_with_expires_delta():
    """Test create_access_token jwt creation with expires_delta param"""

    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    exception = timedelta(minutes=20)
    _time = int((datetime.now() + exception).timestamp())

    token = create_access_token(wallet_id, exception)

    payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=[ALGORITHM])
    assert wallet_id == payload.get("sub")
    assert _time == payload.get("exp")


def test_create_access_token_without_expires_delta():
    """Test create_access_token jwt creation without expires_delta param"""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    exception = timedelta(minutes=15)
    _time = int((datetime.now() + exception).timestamp())

    token = create_access_token(wallet_id)

    payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=[ALGORITHM])
    assert wallet_id == payload.get("sub")
    assert _time == payload.get("exp")


@pytest.mark.asyncio
async def test_get_current_user_success():
    """Test successfully getting the current user by jwt"""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    user_id = uuid.uuid4()

    return_value = {
        "id": str(user_id),
        "wallet_id": wallet_id,
        "deposit": [],
    }

    token = create_access_token(wallet_id)

    with patch.object(
        user_crud, "get_object_by_field", new_callable=AsyncMock
    ) as get_object_by_field:
        get_object_by_field.return_value = return_value

        user = await get_current_user(token)
        assert user == return_value
        get_object_by_field.assert_awaited_once_with(field="wallet_id", value=wallet_id)


@pytest.mark.asyncio
async def test_get_current_user_fails_with_expired_jwt():
    """Test fails with expired jwt"""
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"

    to_encode = {
        "sub": wallet_id,
        "exp": datetime.now(timezone.utc) - timedelta(minutes=25),
    }
    token = jwt.encode(to_encode, os.environ.get("SECRET_KEY"), algorithm=ALGORITHM)

    with pytest.raises(Exception, match="jwt expired"):
        await get_current_user(token)


@pytest.mark.asyncio
async def test_get_current_user_fails_with_invalid_jwt():
    """Test fails with invalid jwt"""

    to_encode = {"exp": datetime.now(timezone.utc) + timedelta(minutes=25)}
    token = jwt.encode(to_encode, os.environ.get("SECRET_KEY"), algorithm=ALGORITHM)

    with pytest.raises(Exception, match="Invalid jwt"):
        await get_current_user(token)


@pytest.mark.asyncio
async def test_get_current_user_fails_if_usr_not_found():
    """Test fails with invalid jwt"""
    to_encode = {
        "sub": "xxx",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=25),
    }
    token = jwt.encode(to_encode, os.environ.get("SECRET_KEY"), algorithm=ALGORITHM)

    with patch.object(
        user_crud, "get_object_by_field", new_callable=AsyncMock
    ) as get_object_by_field:
        get_object_by_field.return_value = None
        with pytest.raises(Exception, match="User not found"):
            await get_current_user(token)
