"""
Main FastAPI application module for the GRAVOEDGE API (Stellar/Soroban).

This module sets up the FastAPI application
and includes middleware for session management and CORS.
It also includes routers for the dashboard, position, and user endpoints.
"""

import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from web_app.api.dashboard import router as dashboard_router
from web_app.api.position import router as position_router
from web_app.api.telegram import router as telegram_router
from web_app.api.user import router as user_router
from web_app.api.vault import router as vault_router
from web_app.api.leaderboard import router as leaderboard_router

# Initialize Sentry SDK if in production
if os.getenv("ENV_VERSION") == "PROD":
    import sentry_sdk

    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=1.0,
        _experiments={
            "continuous_profiling_auto_start": True,
        },
    )


app = FastAPI(
    title="GRAVOEDGE API",
    description=(
        "An API that supports depositing collateral, borrowing stablecoins, "
        "trading on AMMs, and managing user positions via Stellar ecosystem integrations."
    ),
    version="0.1.0",
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

_SESSION_SECRET_MIN_LENGTH = 32
_is_production = os.getenv("ENV_VERSION") == "PROD"

_session_secret = os.getenv("SESSION_SECRET_KEY")

if _session_secret:
    if len(_session_secret) < _SESSION_SECRET_MIN_LENGTH:
        raise ValueError(
            f"SESSION_SECRET_KEY must be at least {_SESSION_SECRET_MIN_LENGTH} characters long."
        )
elif _is_production:
    raise ValueError(
        "SESSION_SECRET_KEY environment variable must be set in production. "
        "Generate one with: python -c \"import os; print(os.urandom(32).hex())\""
    )
else:
    # Development only: auto-generate a key (sessions won't persist across restarts)
    _session_secret = os.urandom(32).hex()

# Add session middleware with a persistent secret key
app.add_middleware(SessionMiddleware, secret_key=_session_secret)
# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"]
)


# No startup-time blockchain contract init needed – the frontend
# invokes Soroban contracts directly via Freighter + stellar-sdk.

# Include the routers
app.include_router(position_router)
app.include_router(dashboard_router)
app.include_router(user_router)
app.include_router(telegram_router)
app.include_router(vault_router)
app.include_router(leaderboard_router)
