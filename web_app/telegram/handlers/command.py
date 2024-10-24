from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

from ..markups import launch_main_web_app_kb
from ..texts import WELCOME_MESSAGE

cmd_router = Router()


@cmd_router.message(CommandStart())
async def start_cmd(message: Message):
    return message.answer(WELCOME_MESSAGE, reply_markup=launch_main_web_app_kb)
