"""
Main entry point for the application.
"""

from app.api.liquidation import router as liquidation_router
from fastapi import FastAPI

app = FastAPI()

app.include_router(liquidation_router, prefix="/api/liquidation", tags=["liquidation"])
