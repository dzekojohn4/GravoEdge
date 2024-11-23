"""
Module for handling vault deposit operations in the SPOTNET API.
"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from web_app.db.crud import DepositDBConnector, UserDBConnector
from web_app.schemas.vault import VaultDepositRequest, VaultDepositResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/vault", tags=["vault"])

@router.post("/deposit", response_model=VaultDepositResponse)
async def deposit_to_vault(
    request: VaultDepositRequest,
    deposit_connector: DepositDBConnector = Depends(DepositDBConnector)
) -> VaultDepositResponse:
    """
    Process a vault deposit request.
    """
    logger.info(f"Processing deposit request for wallet {request.wallet_id}")
    
    try:
        user_db = UserDBConnector()
        user = user_db.get_user_by_wallet_id(request.wallet_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        vault = deposit_connector.create_vault(
            user=user,
            symbol=request.symbol,
            amount=request.amount
        )
        
        return VaultDepositResponse(
            deposit_id=vault.id,
            wallet_id=request.wallet_id,
            amount=request.amount,
            symbol=request.symbol
        )
    except (ValueError, TypeError) as e:
        logger.error(f"Invalid input data: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
