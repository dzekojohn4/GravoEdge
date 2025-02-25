"""
API for handling user endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import user_crud
from app.db.sessions import get_db
from app.schemas.user import AddUserDepositRequest, AddUserDepositResponse

router = APIRouter()

@router.post('/add_user_deposit', status_code=status.HTTP_201_CREATED, response_model=AddUserDepositResponse)
async def add_user_deposit(deposit_request: AddUserDepositRequest, db: AsyncSession = Depends(get_db)):
    try:
        deposit = await user_crud.add_deposit(**deposit_request)
        return AddUserDepositResponse(deposit_id=deposit.id)
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    
