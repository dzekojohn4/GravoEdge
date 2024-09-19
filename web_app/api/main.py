import os
from fastapi import FastAPI
from uuid import uuid4
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from web_app.api.form import router as form_router
from web_app.api.login import router as login_router


app = FastAPI()

# Set up the templates directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Mount static files
app.mount("/static", StaticFiles(directory="web_app/static"), name="static")

# Add session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key=f"Secret:{str(uuid4())}")

# Include the form and login routers
app.include_router(form_router)
app.include_router(login_router)