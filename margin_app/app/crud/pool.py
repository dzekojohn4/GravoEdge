from app.crud.base import DBConnector
from app.models.pool import Pool
import uuid


class PoolCRUD(DBConnector):
    """Handles Database queries for Pools"""
    async def create_pool(self, token: str) -> Pool:
        """
        Creates a new pool
        :param token: string of the token in the pool
        :return Pool the object successfully added to the database
        
        """
        pool_entry: Pool = Pool(token = token)
        return await self.write_to_db(pool_entry)
    
    async def create_pool(self, pool_id: uuid.UUID, new_token: str) -> Pool:
        """
        Updates an existing pool in the database
        :param pool_id: the id of the pool being updated
        :param new_token: string of the token that will replace the old one
        :return Pool the object successfully updated in the database
        
        """
        pool_entry: Pool = await self.get_object(Pool, pool_id)

        if not pool_entry:
            raise ValueError(f"Pool with ID '{pool_id}' not found.")
        
        pool_entry.token = new_token

        return await self.write_to_db(pool_entry)
    

