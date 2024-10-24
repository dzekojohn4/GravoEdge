from web_app.db.crud import DBConnector

from . import bot, dp

if __name__ == "__main__":
    dp.run_polling(bot, db=DBConnector())
