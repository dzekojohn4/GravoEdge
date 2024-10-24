from os import getenv

from dotenv import load_dotenv

load_dotenv()

# Retrieve the Telegram bot token from environment variables
TELEGRAM_TOKEN = getenv("TELEGRAM_TOKEN")
WEBAPP_URL = getenv("TELEGRAM_WEBAPP_URL")
