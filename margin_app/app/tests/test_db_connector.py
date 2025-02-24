"""
Pytest-based asynchronous database tests for CRUD operations.
This module verifies database functionality using SQLAlchemy and an async database connection.
While database operations use the SQLAlchemy ORM model (defined inline), results are converted to a NamedTuple
for simpler, read-only data representation.
"""

import uuid
from typing import NamedTuple

import pytest
import pytest_asyncio
from sqlalchemy import Column, String

from app.models.base import BaseModel

pytestmark = pytest.mark.asyncio


class TestModel(BaseModel):
    """Test database model representing a simple object with an ID and name."""

    __tablename__ = "test_model"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)


class TestObjectTuple(NamedTuple):
    """NamedTuple for test data representation."""

    id: str
    name: str


def to_named_tuple(model_obj: TestModel) -> TestObjectTuple:
    """Converts an ORM model instance to a NamedTuple."""
    return TestObjectTuple(id=model_obj.id, name=model_obj.name)


@pytest_asyncio.fixture
async def test_object(db_connector):
    """Fixture to create a test object in the database."""
    obj = TestModel(name="Test Object")
    obj = await db_connector.write_to_db(obj)
    return to_named_tuple(obj)


async def test_write_to_db(db_connector):
    """Test writing an object to the database."""
    obj = TestModel(name="New Object")
    saved_obj = await db_connector.write_to_db(obj)
    result = to_named_tuple(saved_obj)
    assert result.id is not None
    assert result.name == "New Object"


async def test_get_object(db_connector, test_object):
    """Test retrieving an object by ID."""
    fetched_obj = await db_connector.get_object(TestModel, test_object.id)
    result = to_named_tuple(fetched_obj)
    assert result is not None
    assert result.id == test_object.id
    assert result.name == "Test Object"


async def test_get_object_by_field(db_connector, test_object):
    """Test retrieving an object by a field value."""
    fetched_obj = await db_connector.get_object_by_field(
        TestModel, "name", "Test Object"
    )
    result = to_named_tuple(fetched_obj)
    assert result is not None
    assert result.name == "Test Object"


async def test_delete_object_by_id(db_connector, test_object):
    """Test deleting an object by ID."""
    await db_connector.delete_object_by_id(TestModel, test_object.id)
    fetched_obj = await db_connector.get_object(TestModel, test_object.id)
    assert fetched_obj is None


async def test_delete_object(db_connector):
    """Test deleting an object directly."""
    obj = TestModel(name="To be deleted")
    obj = await db_connector.write_to_db(obj)
    await db_connector.delete_object(obj)
    fetched_obj = await db_connector.get_object(TestModel, obj.id)
    assert fetched_obj is None


async def test_get_nonexistent_object(db_connector):
    """Test retrieving a non-existent object."""
    non_existing_id = str(uuid.uuid4())
    obj = await db_connector.get_object(TestModel, non_existing_id)
    assert obj is None


async def test_get_object_by_invalid_field(db_connector):
    """Test retrieving an object using an invalid field, expecting an exception."""
    with pytest.raises(Exception):
        await db_connector.get_object_by_field(TestModel, "non_existing_field", "value")


async def test_delete_nonexistent_object(db_connector):
    """Test deleting a non-existent object, ensuring no errors are raised."""
    non_existing_id = str(uuid.uuid4())
    await db_connector.delete_object_by_id(TestModel, non_existing_id)


async def test_write_invalid_object(db_connector):
    """Test attempting to write an invalid object, expecting an exception."""
    with pytest.raises(Exception):
        await db_connector.write_to_db(None)
