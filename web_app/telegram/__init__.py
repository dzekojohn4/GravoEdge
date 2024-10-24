from aiogram import Bot, Dispatcher

from .config import TELEGRAM_TOKEN

# Initialize the Telegram bot (None for the ability to run without a bot token)
bot: Bot = None
if TELEGRAM_TOKEN:
    bot = Bot(TELEGRAM_TOKEN)

# Create a Dispatcher for handling updates
dp = Dispatcher()
