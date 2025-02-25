"""
Main entry point for the application.
"""

from fastapi import FastAPI

from app.api.margin_position import router as margin_position_router

app = FastAPI()

app.include_router(margin_position_router, tags=["margin_position"])
