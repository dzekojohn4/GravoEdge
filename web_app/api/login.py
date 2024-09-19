import os
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse

# Setting up templates directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Initializing router
router = APIRouter()


@router.get("/login")
async def login(request: Request):
    """
    Renders the login page if wallet_id is not in session.
    Redirects to home page if wallet_id is present in session.
    """
    # Check if wallet_id exists in session
    wallet_id = request.session.get("wallet_id")

    if wallet_id:
        # Redirect to home page if wallet_id exists
        return RedirectResponse(url="/", status_code=302)

    # Otherwise, render the login page
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
async def connect_wallet(request: Request):
    """
    Connects the wallet and saves the wallet_id to session.
    """
    form = await request.form()
    wallet_id = form.get("wallet_id")
    # Save the wallet_id to session
    request.session["wallet_id"] = wallet_id
    # Redirect to home page
    return RedirectResponse(url="/", status_code=302)


@router.post("/logout")
async def logout(request: Request):
    """
    Log out the user by clearing the wallet_id from the session.
    """
    request.session.pop("wallet_id", None)  # Remove wallet_id from session
    return RedirectResponse(url="/login", status_code=302)