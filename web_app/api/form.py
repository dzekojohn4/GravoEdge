import os

from contract_tools.blockchain_call import StarknetClient
from contract_tools.constants import TokenAddresses
from fastapi import FastAPI, Form, Path
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

app = FastAPI()
CLIENT = StarknetClient()


@app.get("/{holder_address}", response_class=HTMLResponse)
async def get_form(request: Request, holder_address: str = Path(...)):
    wallet_balances = {
        address: CLIENT.get_balance(
            token_addr=address.value, holder_addr=holder_address
        )
        for address in TokenAddresses
    }

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"balances": wallet_balances},
    )


@app.post("/submit")
async def submit_form(
    token: str = Form(...), protocol: str = Form(...), multiplier: int = Form(...)
):
    return {"token": token, "protocol": protocol, "multiplier": multiplier}
