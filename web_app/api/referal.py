from fastapi import APIRouter, HTTPException, FastAPI, Query
import random
import string
from sqlalchemy.orm import Session
from fastapi import Depends
from web_app.db.database import get_db
from web_app.db.models import User

app = FastAPI()
router = APIRouter(
    prefix="/api",
    tags=["referral"],
    responses={404: {"description": "Not found"}},
)


def generate_random_string(length=16):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@router.get("/create_referal_link")
async def create_referal_link(
    wallet_id: str = Query(..., description="Wallet ID of the user"),
    db: Session = Depends(get_db),
):
    """
    Create a referral link for a user.

    Args:
        wallet_id (str): The wallet ID of the user

    Returns:
        dict: Wallet ID and the generated referral code

    Raises:
        HTTPException: If the user is not found in the database
    """
    
    user = db.query(User).filter(User.wallet_id == wallet_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with the provided wallet_id does not exist")

    
    referral_code = generate_random_string()
    return {"wallet_id": wallet_id, "referral_code": referral_code}


app.include_router(router)
