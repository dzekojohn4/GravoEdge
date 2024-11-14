from decimal import Decimal
from web_app.telegram import bot, logger
from web_app.db.crud import TelegramUserDBConnector


async def send_health_ratio_notification(telegram_id: str, health_ratio: Decimal) -> None:
    """
    Send notification about health ratio to user
    """
    message = (
        f"⚠️ Warning: Your health ratio level is {health_ratio}. "
        f"This is getting low - please add more deposit to avoid liquidation.\n\n"
        f"Visit app.spotnet.xyz to manage your position."
    )
    
    try:
        telegram_db = TelegramUserDBConnector()
        user = telegram_db.get_user_by_telegram_id(telegram_id)
        
        if user and user.is_allowed_notification:
            await bot.send_message(chat_id=telegram_id, text=message)
    except Exception as e:
        logger.error(f"Failed to send notification to {telegram_id}: {e}")

async def send_welcome_message(telegram_id: str) -> None:
    """
    Send welcome message when user enables notifications
    """
    message = (
        "🔔 Notifications enabled!\n\n"
        "You will now receive alerts about:\n"
        "- Health ratio changes\n"
        "- Position updates\n\n"
        "You can disable notifications at any time in the app settings."
    )
    await bot.send_message(chat_id=telegram_id, text=message)