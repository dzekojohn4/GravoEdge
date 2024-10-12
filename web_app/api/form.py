from fastapi import APIRouter, Depends, Request

from web_app.api.serializers.transaction import (
    ApproveData,
    LoopLiquidityData,
    TransactionDataRequest,
    TransactionDataResponse,
)
from web_app.api.serializers.form import PositionFormData
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.mixins.deposit import DepositMixin
from web_app.db.crud import PositionDBConnector

router = APIRouter()  # Initialize the router
position_db_connector = PositionDBConnector()  # Initialize the PositionDBConnector

@router.post("/api/create-position", response_model=TransactionDataResponse)
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

    response = TransactionDataResponse(
        approve_data=approve_data, loop_liquidity_data=loop_liquidity_data
    )
    print("response", response.dict())

    return response
