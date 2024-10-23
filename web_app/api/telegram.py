from typing import Literal

from aiogram.types import Update
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from web_app.db.crud import DBConnector
from web_app.telegram import bot, dp
from web_app.telegram.utils import build_response_writer

router = APIRouter(include_in_schema=False)
db_connector = DBConnector()


@router.get("/api/webhook/telegram")
async def set_telegram_webhook(request: Request) -> Literal["ok"]:
    url = str(request.url.replace(query=""))
    await bot.set_webhook(url=url)
    return "ok"


@router.post("/api/webhook/telegram")
async def telegram_webhook(update: Update):
    result = await dp.feed_webhook_update(bot, update, db=db_connector)
    return StreamingResponse(
        build_response_writer(bot, result), media_type="multipart/form-data"
    )
