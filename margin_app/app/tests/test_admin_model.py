""" tests/test_admin_model.py"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from margin_app.app.models.admin import Admin
from margin_app.app.models.base import BaseModel  

""" Create an in-memory SQLite database for testing"""
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="module")
def engine():
    engine = create_engine(TEST_DATABASE_URL)
    BaseModel.metadata.create_all(engine)
    yield engine
    BaseModel.metadata.drop_all(engine)

@pytest.fixture(scope="function")
def db_session(engine):
    """Creates a new database session for a test."""
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()
    yield session
    session.close()
    transaction.rollback()
    connection.close()

def test_create_admin(db_session):
    """"Create an admin instance"""
    admin = Admin(
        email="admin@example.com",
        name="Test Admin",
        is_super_admin=True,
        password="hashedpassword123"
    )
    db_session.add(admin)
    db_session.commit()
    
    """Retrieve the admin from the database"""

    retrieved = db_session.query(Admin).filter_by(email="admin@example.com").first()
    assert retrieved is not None
    assert retrieved.name == "Test Admin"
    assert retrieved.is_super_admin is True

def test_unique_email_constraint(db_session):
    admin1 = Admin(
        email="unique@example.com",
        name="Admin One",
        is_super_admin=False,
        password="hashedpassword123"
    )
    admin2 = Admin(
        email="unique@example.com",  
        name="Admin Two",
        is_super_admin=False,
        password="hashedpassword456"
    )
    db_session.add(admin1)
    db_session.commit()
    
    db_session.add(admin2)
    with pytest.raises(Exception):
        db_session.commit()  
