"""
This module contains the API routes for the user.
"""
from fastapi import APIRouter,status, HTTPException
from loguru import logger
from ..crud.user import user_crud as crud_create_user
from app.schemas.user import UserResponse, UserCreate

router = APIRouter()


@router.post(
    "/users", 
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    )

async def create_user(user: UserCreate)-> UserResponse:

    """
    Create a new user.

    Parameters:
    - wallet_id: str, the wallet ID of the user

    Returns:
    - UserResponse: The created user object
    """
    try:
        user = await crud_create_user.create_user(user.wallet_id)
    except Exception as e:
        logger.error(f"Error creating user pool: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong.",
        ) from e
    return user