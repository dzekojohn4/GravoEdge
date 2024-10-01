import os
from uuid import uuid4

from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from web_app.api.dashboard import router as dashboard_router
from web_app.api.form import router as form_router

app = FastAPI()

# Set up the templates directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Add session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key=f"Secret:{str(uuid4())}")

# Include the form and login routers
app.include_router(form_router)
app.include_router(dashboard_router)
