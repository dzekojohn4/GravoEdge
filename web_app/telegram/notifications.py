from decimal import Decimal
from aiogram.exceptions import TelegramRetryAfter

from web_app.db.crud import TelegramUserDBConnector
from web_app.telegram import bot, logger

from .texts import HEALTH_RATIO_WARNING_MESSAGE, NOTIFICATIONS_ENABLED_MESSAGE


async def send_health_ratio_notification(
    telegram_id: str, health_ratio: Decimal, retry_count: int = 1
) -> None:
    """
    Send notification about health ratio to user
    """
    try:
        telegram_db = TelegramUserDBConnector()
        user = telegram_db.get_user_by_telegram_id(telegram_id)

        if user and user.is_allowed_notification:
            await bot.send_message(
                chat_id=telegram_id,
                text=HEALTH_RATIO_WARNING_MESSAGE.format(health_ratio=health_ratio),
            )
    except TelegramRetryAfter as e:
        if retry_count < 1:
            return logger.error(f"Failed to send notification to {telegram_id}: {e}")
        retry_after = 10  # default sleep
        if 0 < e.retry_after:
            retry_after = e.retry_after
        await asyncio.sleep(retry_after)
        await send_health_ratio_notification(
            telegram_id, health_ratio, retry_count=retry_count - 1
        )
    except Exception as e:
        logger.error(f"Failed to send notification to {telegram_id}: {e}")


async def send_subscribe_to_notification_message(telegram_id: str) -> None:
    """
    Send message when user enables notifications
    """
    await bot.send_message(chat_id=telegram_id, text=NOTIFICATIONS_ENABLED_MESSAGE)
