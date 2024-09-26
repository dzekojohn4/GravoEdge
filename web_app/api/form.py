from datetime import datetime
from typing import List
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from web_app.api.serializers.transaction import (
    ApproveData,
    LoopLiquidityData,
    TransactionDataRequest,
    TransactionDataResponse,
)
from web_app.api.settings import DATE_TIME_FORMAT
from web_app.contract_tools.constants import TokenParams
from web_app.contract_tools.utils import DashboardMixin, DepositMixin

# Initialize the client and templates
templates = Jinja2Templates(directory="web_app/api/templates")
router = APIRouter()  # Initialize the router


@router.get("/", response_class=HTMLResponse)
async def get_form(request: Request):
    """
    Fetch wallet balances and render the form.
    Get the form to submit the token, protocol, and multiplier.
    :param request: Request object
    :return: TemplateResponse
    """
    # Check if the wallet_id is in session
    session_wallet_id = request.session.get("wallet_id")
    if session_wallet_id:
        holder_address = session_wallet_id
    else:
        # Redirect to login if no wallet_id in session
        return RedirectResponse(url="/login", status_code=302)

    # Fetch the balance for each token in TokenParams
    wallet_balances = await DashboardMixin.get_wallet_balances(holder_address)
    # Render the template with the balances
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "holder_address": holder_address,
            "balances": wallet_balances,
        },
    )


# Global dictionaries to store form data (you likely want to refactor this for production)
multipliers = {}
start_dates = {}


@router.post("/submit")
async def submit_form(
    token: str = Form(...),
    multiplier: int = Form(...),
    amount: str = Form(...),
):
    """
    Submit form data, store it, and redirect to the transaction-data endpoint.
    Send amount in a string to have  control over the amount.
    """
    # Save submitted form data
    multipliers[token] = multiplier
    start_dates[token] = datetime.now().strftime(DATE_TIME_FORMAT)

    # Construct query parameters for redirect
    query_params = urlencode(
        {"token": token, "multiplier": multiplier, "amount": amount}
    )
    # Redirect to the /transaction-data endpoint with query parameters
    return RedirectResponse(f"/transaction-data?{query_params}", status_code=303)


@router.get("/transaction-data", response_model=List[TransactionDataResponse])
async def get_transaction_data(
    request: Request,
    transaction_data: TransactionDataRequest = Depends(),
) -> List[TransactionDataResponse]:
    """
    Get transaction data for the deposit.
    :param request: Request object
    :param transaction_data: Pydantic model for the query parameters
    :return: List of dicts containing the transaction data
    """
    wallet_id = request.session.get("wallet_id")
    if not wallet_id:
        return RedirectResponse(url="/login", status_code=302)

    # Get the transaction data from the DepositMixin
    transaction_result = await DepositMixin.get_transaction_data(
        transaction_data.token,
        transaction_data.amount,
        transaction_data.multiplier,
        wallet_id,
        TokenParams.USDC.address,
    )

    # Pass the raw result to the models, they will handle the conversion
    approve_data = ApproveData(**transaction_result[0])
    loop_liquidity_data = LoopLiquidityData(**transaction_result[1])

    response = TransactionDataResponse(
        approve_data=approve_data, loop_liquidity_data=loop_liquidity_data
    )

    return [response]
