"""
This module contains the MarginPositionCRUD Class for opening ,
updating and closing margin positions.
"""

import uuid
from decimal import Decimal
from typing import List, Optional, Type, Any
from sqlalchemy import select
from app.crud.base import DBConnector, ModelType
from app.models.margin_position import MarginPosition
from app.models.margin_position import MarginPositionStatus
from app.schemas.margin_position import MarginPositionResponse


class MarginPositionCRUD(DBConnector):
    """"Handles margin position database operations"""
    async def open_margin_position(
        self, user_id: uuid.UUID,
        borrowed_amount: Decimal,
        multiplier: int,
        transaction_id: str
    ) -> MarginPosition:
        """
        Opens a margin position by creating an entry record in the database.
        :param user_id: uuid
        :param borrowed_amount: Decimal
        :param multiplier int
        :param transaction_id str
        :return: MarginPosition
        """
        position_entry = MarginPosition(
            user_id=user_id,
            borrowed_amount=borrowed_amount,
            multiplier=multiplier,
            transaction_id=transaction_id
        )
        position = await self.write_to_db(position_entry)
        return position

    async def close_margin_position(self, position_id : uuid.UUID) -> MarginPositionStatus:
        """
        Closes a margin position by updating the position status in the database.
        :param position_id: uuid
        :return: MarginPositionStatus
        """

        position = await self.get_object(MarginPosition, position_id)
        if position:
            position.status = MarginPositionStatus.CLOSED
            await self.write_to_db(position)
            return position.status

    async def get_objects(self, model: Type[ModelType], where_clause: Optional[Any] = None) -> List[ModelType]:
        """
        Retrieves all objects of the specified model type with an optional where clause.
        
        :param model: The model class to query
        :param where_clause: Optional SQLAlchemy where clause to filter results
                            Example: Model.field == value or Model.field.isnot(None)
        :return: List of model instances matching the criteria
        
        :raises Exception: If there's an error executing the database query
        """
        async with self.session() as db:
            try:
                query = select(model)
                if where_clause is not None:
                    query = query.where(where_clause)
                
                result = await db.execute(query)
                return list(result.scalars().all())
            except Exception as e:
                # Log the error or handle it as needed
                raise Exception(f"Error retrieving objects: {str(e)}") from e
            
    async def get_all_liquidated_positions(self) -> List[MarginPositionResponse]:
        """
        Retrieves all liquidated margin positions from the database.
        
        Uses the get_objects method with a filter for liquidated positions.

        Returns:
            List[MarginPositionResponse]: List of all liquidated margin positions
            
        Raises:
            Exception: If there's an error retrieving the positions
        """
        positions = await self.get_objects(
            MarginPosition, 
            MarginPosition.liquidated_at.isnot(None)
        )
        return [MarginPositionResponse.from_orm(pos) for pos in positions]

margin_position_crud = MarginPositionCRUD()
