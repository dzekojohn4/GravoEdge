from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..database import get_db
from ..crud.user import create_user as crud_create_user

router = APIRouter()

class UserCreate(BaseModel):
    wallet_id: str

class UserResponse(BaseModel):
    id: int
    wallet_id: str
    created_at: datetime

@router.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user.

    Parameters:
    - wallet_id: str, the wallet ID of the user

    Returns:
    - UserResponse: The created user object
    """
    db_user = await crud_create_user(db, user.wallet_id)
    if db_user is None:
        raise HTTPException(status_code=400, detail="User could not be created")
    return db_user