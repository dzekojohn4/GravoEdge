from fastapi import APIRouter, Request

from web_app.api.serializers.transaction import (
    LoopLiquidityData,
    RepayTransactionDataResponse,
)
from web_app.api.serializers.position import PositionFormData
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.mixins.deposit import DepositMixin
from web_app.db.crud import PositionDBConnector

router = APIRouter()  # Initialize the router
position_db_connector = PositionDBConnector()  # Initialize the PositionDBConnector


@router.post("/api/create-position", tags=["Position Operations"], response_model=LoopLiquidityData, summary="Create a new position", response_description="Returns the new position and transaction data.")
async def create_position_with_transaction_data(
    request: Request, form_data: PositionFormData
) -> LoopLiquidityData:
    """
    This endpoint creates a new user position.
    
    ### Parameters:
    - **wallet_id**: The wallet ID of the user.
    - **token_symbol**: The symbol of the token used for the position.
    - **amount**: The amount of the token being deposited.
    - **multiplier**: The multiplier applied to the user's position.
    
    ### Returns:
    The created position's details and transaction data.
    """

    
    # Create a new position in the database
    position = position_db_connector.create_position(
        form_data.wallet_id,
        form_data.token_symbol,
        form_data.amount,
        form_data.multiplier,
    )
    # Get the transaction data for the deposit
    deposit_data = await DepositMixin.get_transaction_data(
        form_data.token_symbol,
        form_data.amount,
        form_data.multiplier,
        form_data.wallet_id,
        TokenParams.USDC.address,
    )
    deposit_data["contract_address"] = (
        position_db_connector.get_contract_address_by_wallet_id(form_data.wallet_id)
    )
    deposit_data["position_id"] = str(position.id)
    return LoopLiquidityData(**deposit_data)


@router.get("/api/get-repay-data", tags=["Position Operations"], response_model=RepayTransactionDataResponse, summary="Get repay data", response_description="Returns the repay transaction data.")
async def get_repay_data(
    supply_token: str, wallet_id: str
) -> RepayTransactionDataResponse:
    """
    Get the necessary data to repay a loan and close a position.
    
    ### Parameters:
    - **supply_token**: Supply token address
    - **wallet_id**: User's wallet ID
    
    Returns:
    The repay transaction data.
    """
    
    if not wallet_id:
        raise ValueError("Wallet ID is required")

    contract_address = position_db_connector.get_contract_address_by_wallet_id(
        wallet_id
    )
    position_id = position_db_connector.get_position_id_by_wallet_id(wallet_id)
    repay_data = await DepositMixin.get_repay_data(supply_token)
    repay_data["contract_address"] = contract_address
    repay_data["position_id"] = str(position_id)
    return repay_data


@router.get("/api/close-position", tags=["Position Operations"], response_model=str, summary="Close a position", response_description="Returns the position status")
async def close_position(position_id: str) -> str:
    """
    This endpoint closes a user's position.
    
    ### Parameters:
    - **position_id**: Position ID
    
    ### Returns:
    The position status
    """
    
    if position_id is None or position_id == 'undefined':
        raise ValueError("Invalid position_id provided")

    position_status = position_db_connector.close_position(position_id)
    return position_status


@router.get("/api/open-position", tags=["Position Operations"], response_model=str, summary="Open a position", response_description="Returns the positions status")
async def open_position(position_id: str) -> str:
    """
    This endpoint opens a user's position.
    
    ### Parameters:
    - **position_id**: Position ID
    
    ### Returns:
    The position status
    """
    
    if not position_id:
        raise ValueError("Position ID is required")

    position_status = position_db_connector.open_position(position_id)
    return position_status
