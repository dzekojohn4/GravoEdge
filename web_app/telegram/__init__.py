from aiogram import Bot, Dispatcher

from .config import TELEGRAM_TOKEN
from .handlers import cmd_router

# Initialize the Telegram bot (None for the ability to run without a bot token)
bot: Bot = None
if TELEGRAM_TOKEN:
    # Create a Bot instance using the provided token
    bot = Bot(TELEGRAM_TOKEN)

# Create a Dispatcher for handling updates
dp = Dispatcher()
# Include command routers for handling specific commands
dp.include_routers(cmd_router)
