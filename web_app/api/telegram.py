from typing import Literal

from aiogram.types import Update
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from web_app.db.crud import DBConnector
from web_app.telegram import bot, dp
from web_app.telegram.utils import build_response_writer

# Create a FastAPI router for handling Telegram webhook requests
router = APIRouter(include_in_schema=False)
db_connector = DBConnector()


@router.get("/api/webhook/telegram")
async def set_telegram_webhook(request: Request) -> Literal["ok"]:
    """
    Set the webhook for Telegram bot.

    This endpoint is called to set the webhook URL for the Telegram bot.
    It extracts the URL from the request and sets it as the webhook.

    Args:
        request (Request): The FastAPI request object.

    Returns:
        Literal["ok"]: A confirmation message indicating the webhook has been set.
    """
    url = str(request.url.replace(query=""))
    await bot.set_webhook(url=url)
    return "ok"


@router.post("/api/webhook/telegram")
async def telegram_webhook(update: Update):
    """
    Handle incoming updates from Telegram.

    This endpoint is called when Telegram sends an update to the webhook.
    It processes the update and returns a streaming response.

    Args:
        update (Update): The update object received from Telegram.

    Returns:
        StreamingResponse: A streaming response containing the result of the update processing.
    """
    result = await dp.feed_webhook_update(bot, update, db=db_connector)
    return StreamingResponse(
        build_response_writer(bot, result), media_type="multipart/form-data"
    )
