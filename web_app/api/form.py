from fastapi.templating import Jinja2Templates
from web_app.contract_tools.blockchain_call import StarknetClient
from web_app.contract_tools.constants import TokenParams
from fastapi import Form, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.requests import Request

# Initialize the client and templates
CLIENT = StarknetClient()
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

    wallet_balances = {}

    # Fetch the balance for each token in TokenParams
    for token in TokenParams:
        token_address, decimals = token.value
        balance = await CLIENT.get_balance(
            token_addr=token_address, holder_addr=holder_address, decimals=decimals
        )
        wallet_balances[token.name] = balance

    # Render the template with the balances
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "holder_address": holder_address,
            "balances": wallet_balances,
        },
    )


@router.post("/submit")
async def submit_form(
    token: str = Form(...), protocol: str = Form(...), multiplier: int = Form(...)
):
    """
    Submit the form and return the response.
    :param token: Token address
    :param protocol: Protocol address
    :param multiplier: Multiplier
    :return: dict
    """
    return {"token": token, "protocol": protocol, "multiplier": multiplier}
