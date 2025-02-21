"""
This module contains the base CRUD database configuration using settings from config.py.
"""

import logging
import uuid
from typing import Type, TypeVar

from sqlalchemy import create_engine
from app.core.config import settings

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class DBConnector:
    """
    Provides database connection and operations management using SQLAlchemy
    in a FastAPI application context.

    Methods:
    - write_to_db: Writes an object to the database.
    - get_object: Retrieves an object by its ID in the database.
    - remove_object: Removes an object by its ID from the database.
    """

    def __init__(self):  # Use settings from config.py
        """
        Initialize the database connection and session factory.
        :param db_url: str = None
        """
        self.engine = create_engine(settings.db_url)
        self.session_factory = sessionmaker(bind=self.engine)
        self.Session = scoped_session(self.session_factory)

    def write_to_db(self, obj: Base = None) -> Base:
        """
        Writes an object to the database. Rolls back the transaction if there's an error.
        Refreshes the object to keep it attached to the session.
        :param obj: Base = None
        :raise Exception: If the database operation fails.
        :return: Base - the updated object
        """
        with self.Session() as session:
            try:
                session.add(obj)
                session.commit()
                session.refresh(obj)
                return obj

            except Exception as e:
                session.rollback()
                logger.error(f"Error writing to database: {e}")
                raise e

    def get_object(
        self, model: Type[ModelType] = None, obj_id: uuid.UUID = None
    ) -> ModelType | None:
        """
        Retrieves an object by its ID from the database.
        :param model: type[Base] = None
        :param obj_id: uuid.UUID = None
        :return: Base | None
        """
        db = self.Session()
        try:
            return db.query(model).filter(model.id == obj_id).first()
        finally:
            db.close()

    def get_object_by_field(
        self, model: Type[ModelType] = None, field: str = None, value: str = None
    ) -> ModelType | None:
        """
        Retrieves an object by a specified field from the database.
        :param model: type[Base] = None
        :param field: str = None
        :param value: str = None
        :return: Base | None
        """
        db = self.Session()
        try:
            return db.query(model).filter(getattr(model, field) == value).first()
        finally:
            db.close()

    def delete_object_by_id(
        self, model: Type[Base] = None, obj_id: uuid.UUID = None
    ) -> None:
        """
        Delete an object by its ID from the database. Rolls back if the operation fails.
        :param model: type[Base] = None
        :param obj_id: uuid.UUID = None
        :return: None
        :raise Exception: If the database operation fails
        """
        db = self.Session()
        try:
            obj = db.query(model).filter(model.id == obj_id).first()
            if obj:
                db.delete(obj)
                db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting object by ID: {e}")
            raise e
        finally:
            db.close()

    def delete_object(self, object: Base) -> None:
        """
        Deletes an object from the database.
        :param object: Object to delete
        """
        db = self.Session()
        try:
            db.delete(object)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting object: {e}")
            raise e
        finally:
            db.close()
