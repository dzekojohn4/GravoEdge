from typing import Literal

from aiogram.types import Update
from aiogram.utils.web_app import check_webapp_signature
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from web_app.api.serializers.telegram import (TelegramUserAuth,
                                              TelegramUserCreate)
from web_app.db.acrud import AsyncTelegramUserDBConnector
from web_app.db.crud import DBConnector
from web_app.telegram import TELEGRAM_TOKEN, bot, dp
from web_app.telegram.utils import (build_response_writer,
                                    check_telegram_authorization)

# Create a FastAPI router for handling Telegram webhook requests
router = APIRouter()
db_connector = DBConnector()
adb_telegram_user = AsyncTelegramUserDBConnector()


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


@router.post("/api/webhook/telegram", include_in_schema=False)
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


@router.post(
    "/api/telegram/save-user",
    tags=["Telegram Operations"],
    summary="Save or update Telegram user information",
)
async def save_telegram_user(user: TelegramUserCreate):
    """
    Save or update Telegram user information in the database.

    ### Parameters:
    - **user**: TelegramUserCreate object containing user information

    ### Returns:
    A dictionary with a success message
    """
    try:
        await adb_telegram_user.save_or_update_user(user.model_dump())
        return {"message": "Telegram user saved successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error saving Telegram user: {str(e)}"
        )


@router.get(
    "/api/telegram/get-wallet-id/{telegram_id}",
    tags=["Telegram Operations"],
    summary="Get wallet ID for a Telegram user",
)
async def get_wallet_id(telegram_auth: TelegramUserAuth, telegram_id: str):
    """
    Retrieve the wallet ID associated with a Telegram user.

    ### Parameters:
    - **telegram_auth**: Telegram authorization data or webapp init data
    - **telegram_id**: Telegram user ID

    ### Returns:
        A dictionary containing the wallet ID or None if not found
    """
    if telegram_auth.is_webapp:
        is_valid = check_webapp_signature(TELEGRAM_TOKEN, telegram_auth.raw)
    else:
        is_valid = check_telegram_authorization(TELEGRAM_TOKEN, telegram_auth.raw)

    if is_valid:
        return HTTPException(400, "Telegram auth data is invalid.")

    wallet_id = await adb_telegram_user.get_wallet_id_by_telegram_id(telegram_id)
    return {"wallet_id": wallet_id}
