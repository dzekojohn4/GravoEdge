import secrets
from typing import Dict, Optional

from aiogram import Bot
from aiogram.methods import TelegramMethod
from aiogram.methods.base import TelegramType
from aiogram.types import InputFile
from aiohttp import MultipartWriter


def build_response_writer(
    bot: Bot, result: Optional[TelegramMethod[TelegramType]]
) -> MultipartWriter:
    writer = MultipartWriter(
        "form-data",
        boundary=f"webhookBoundary{secrets.token_urlsafe(16)}",
    )
    if not result:
        return writer

    payload = writer.append(result.__api_method__)
    payload.set_content_disposition("form-data", name="method")

    files: Dict[str, InputFile] = {}
    for key, value in result.model_dump(warnings=False).items():
        value = bot.session.prepare_value(value, bot=bot, files=files)
        if not value:
            continue
        payload = writer.append(value)
        payload.set_content_disposition("form-data", name=key)

    for key, value in files.items():
        payload = writer.append(value.read(bot))
        payload.set_content_disposition(
            "form-data",
            name=key,
            filename=value.filename or key,
        )

    return writer
