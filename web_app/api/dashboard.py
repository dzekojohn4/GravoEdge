from datetime import datetime

from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from web_app.api.form import multipliers
from web_app.contract_tools.utils import DashboardMixin

# Initialize the client and templates
templates = Jinja2Templates(directory="web_app/api/templates")
router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(request: Request):
    """
    Get the dashboard with the balances, multipliers, start dates, and zkLend position.
    :param request: HTTP request
    :return: template response
    """
    # Pass balances, multipliers, and start_dates to the template
    wallet_id = request.session.get("wallet_id")
    if not wallet_id:
        return RedirectResponse("/login", status_code=302)

    # Fetch zkLend position for the wallet ID
    zklend_position = await DashboardMixin.get_zklend_position(wallet_id)

    # Fetch balances (assuming you have a method for this)
    wallet_balances = await DashboardMixin.get_wallet_balances(wallet_id)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "balances": wallet_balances,
            "multipliers": {"ETH": 5},
            "start_dates": {"ETH": datetime.now()},
            "zklend_position": zklend_position,
        },
    )
