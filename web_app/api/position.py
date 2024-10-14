from fastapi import APIRouter, Request

from web_app.api.serializers.transaction import (
    ApproveData,
    LoopLiquidityData,
    DepositTransactionDataResponse, RepayTransactionDataResponse,
)
from web_app.api.serializers.form import PositionFormData
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.mixins.deposit import DepositMixin
from web_app.db.crud import PositionDBConnector

router = APIRouter()  # Initialize the router
position_db_connector = PositionDBConnector()  # Initialize the PositionDBConnector

@router.post("/api/create-position", response_model=DepositTransactionDataResponse)
async def create_position_with_transaction_data(
    request: Request, form_data: PositionFormData
) -> dict:
    """
    Create a new position in the database and return transaction data.
    :param request: Request object
    :param form_data: Pydantic model for the form data
    :return: Dict containing the created position and transaction data
    """
    # Create a new position in the database
    position_db_connector.create_position(
        form_data.wallet_id,
        form_data.token_symbol,
        form_data.amount,
        form_data.multiplier,
    )
    contract_address = position_db_connector.get_contract_address_by_wallet_id(form_data.wallet_id)

    # Get the transaction data for the deposit
    transaction_result = await DepositMixin.get_transaction_data(
        form_data.token_symbol,
        form_data.amount,
        form_data.multiplier,
        form_data.wallet_id,
        TokenParams.USDC.address,
    )

    # Pass the raw result to the models, they will handle the conversion
    approve_data = ApproveData(**transaction_result[0])
    loop_liquidity_data = LoopLiquidityData(**transaction_result[1])

    response = DepositTransactionDataResponse(
        approve_data=approve_data, loop_liquidity_data=loop_liquidity_data, contract_address=contract_address
    )

    return response


@router.get("/api/get-repay-data", response_model=RepayTransactionDataResponse)
async def get_repay_data(supply_token: str):
    """
    Obtain data for position closing.
    :param supply_token: Supply token address
    :return: Dict containing the repay transaction data
    """
    return await DepositMixin.get_repay_data(supply_token)
