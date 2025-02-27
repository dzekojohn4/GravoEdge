"""
Main entry point for the application.

This module initializes the FastAPI application and includes all routers.
"""

from fastapi import FastAPI

from app.api.margin_position import router as margin_position_router

app = FastAPI(
    title="Margin Trading API",
    description="API for managing margin trading positions",
    version="1.0.0",
)

# Include routers
app.include_router(
    margin_position_router, prefix="/api/margin-positions", tags=["margin-positions"]
)
