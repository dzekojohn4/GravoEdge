from fastapi import APIRouter, Request

from web_app.api.serializers.transaction import (
    LoopLiquidityData,
    RepayTransactionDataResponse,
)
from web_app.api.serializers.form import PositionFormData
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.mixins.deposit import DepositMixin
from web_app.db.crud import PositionDBConnector

router = APIRouter()  # Initialize the router
position_db_connector = PositionDBConnector()  # Initialize the PositionDBConnector


@router.post("/api/create-position", response_model=LoopLiquidityData)
async def create_position_with_transaction_data(
    request: Request, form_data: PositionFormData
) -> LoopLiquidityData:
    """
    Create a new position in the database and return transaction data.
    :param request: Request object
    :param form_data: Pydantic model for the form data
    :return: Dict containing the created position and transaction data
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
    print(f"Deposit data: {deposit_data}")
    return LoopLiquidityData(**deposit_data)


@router.get("/api/get-repay-data", response_model=RepayTransactionDataResponse)
async def get_repay_data(
    supply_token: str, wallet_id: str
) -> RepayTransactionDataResponse:
    """
    Obtain data for position closing.
    :param supply_token: Supply token address
    :param wallet_id: Wallet ID
    :return: Dict containing the repay transaction data
    """
    if not wallet_id:
        raise ValueError("Wallet ID is required")

    contract_address = position_db_connector.get_contract_address_by_wallet_id(
        wallet_id
    )
    repay_data = await DepositMixin.get_repay_data(supply_token)
    repay_data["contract_address"] = contract_address
    return repay_data


@router.get("/api/close-position", response_model=str)
async def close_position(position_id: str) -> str:
    """
    Close a position.
    :param position_id: contract address
    :return: str
    """
    if not position_id:
        raise ValueError("Position ID is required")

    position_status = position_db_connector.close_position(position_id)
    return position_status


@router.get("/api/open-position", response_model=str)
async def open_position(position_id: str) -> str:
    """
    Open a position.
    :param position_id: contract address
    :return: str
    """
    if not position_id:
        raise ValueError("Position ID is required")

    position_status = position_db_connector.open_position(position_id)
    return position_status
