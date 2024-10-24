from web_app.db.crud import DBConnector

from . import bot, dp

if __name__ == "__main__":
    # Start polling for updates with the bot and database connector
    dp.run_polling(bot, db=DBConnector())
