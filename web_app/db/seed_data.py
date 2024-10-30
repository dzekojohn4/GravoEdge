import os 
import sys
from sqlalchemy import create_engine  
from sqlalchemy.orm import sessionmaker  
from faker import Faker  
# from web_app.db.models import User, Position, AirDrop, TelegramUser
# from web_app.db.database import Base
from .models import User, Position, AirDrop, TelegramUser  
from .database import Base
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))) 
load_dotenv()

# Database connection settings  
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

DATABASE_URL = "postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create a new database session  
engine = create_engine(DATABASE_URL)  
Session = sessionmaker(bind=engine)  
session = Session()  

# Initialize Faker  
fake = Faker()  

def create_users():  
    users = []  
    for _ in range(10):  
        user = User(  
            wallet_id=fake.unique.uuid4(),  
            contract_address=fake.address(),  
            is_contract_deployed=fake.boolean()  
        )  
        users.append(user)  
    session.bulk_save_objects(users)  
    session.commit()  
    return users  

def create_positions(users):  
    positions = []  
    for user in users:  
        for _ in range(10):  
            position = Position(  
                user_id=user.id,  
                token_symbol=fake.word(),  
                amount=fake.random_number(digits=5),  
                multiplier=fake.random_int(min=1, max=10),  
                start_price=fake.pydecimal(left_digits=5, right_digits=2, positive=True),  
                status=fake.random_element(elements=[status.value for status in Status]),  
            )  
            positions.append(position)  
    session.bulk_save_objects(positions)  
    session.commit()  

def create_airdrops(users):  
    airdrops = []  
    for user in users:  
        for _ in range(10):  
            airdrop = AirDrop(  
                user_id=user.id,  
                amount=fake.pydecimal(left_digits=5, right_digits=2, positive=True),  
                is_claimed=fake.boolean(),  
                claimed_at=fake.date_time_this_decade() if fake.boolean() else None,  
            )  
            airdrops.append(airdrop)  
    session.bulk_save_objects(airdrops)  
    session.commit()  

def create_telegram_users():  
    telegram_users = []  
    for _ in range(10):  
        telegram_user = TelegramUser(  
            telegram_id=fake.unique.uuid4(),  
            username=fake.user_name(),  
            first_name=fake.first_name(),  
            last_name=fake.last_name(),  
            wallet_id=fake.unique.uuid4(),
            photo_url=fake.image_url(),  
        )  
        telegram_users.append(telegram_user)  
    session.bulk_save_objects(telegram_users)  
    session.commit()  

if __name__ == '__main__':  
    # Create tables  
    Base.metadata.create_all(engine)  

    # Populate the database  
    users = create_users()  
    create_positions(users)  
    create_airdrops(users)  
    create_telegram_users()  

    print("Database populated with fake data.")