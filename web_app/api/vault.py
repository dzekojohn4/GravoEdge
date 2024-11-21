from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from decimal import Decimal

from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.db.models import VaultDeposit
from web_app.db.database import get_database
from web_app.schemas.vault import VaultDepositRequest, VaultDepositResponse

router = APIRouter(prefix="/api/vault", tags=["vault"])
client = StarknetClient()

@router.post("/deposit", response_model=VaultDepositResponse)
async def deposit_to_vault(request: VaultDepositRequest, db=Depends(get_database)) -> VaultDepositResponse:
    """
    Endpoint to handle deposits to the vault
    
    Args:
        request: VaultDepositRequest containing wallet_id, amount and symbol
        
    Returns:
        VaultDepositResponse with transaction details
    """
    try:
        # Validate wallet balance
        balance = await client.get_balance(
            token_addr=request.symbol,
            holder_addr=request.wallet_id
        )
        
        if Decimal(balance) < request.amount:
            raise HTTPException(
                status_code=400,
                detail="Insufficient balance for deposit"
            )

        # Create vault deposit record
        deposit = VaultDeposit(
            wallet_id=request.wallet_id,
            amount=request.amount,
            symbol=request.symbol,
            status="pending"
        )
        
        db.add(deposit)
        await db.commit()
        await db.refresh(deposit)

        return VaultDepositResponse(
            deposit_id=deposit.id,
            wallet_id=deposit.wallet_id,
            amount=deposit.amount,
            symbol=deposit.symbol,
            status=deposit.status
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process deposit: {str(e)}"
        )