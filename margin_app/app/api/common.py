from typing import Any, Callable, List, Optional

from fastapi import APIRouter, HTTPException, status

router = APIRouter()


# Define a generic mediator for “get all” endpoints
class GetAllMediator:
    def __init__(
        self, crud_func: Callable[..., Any], limit: Optional[int], offset: int
    ):
        self.crud_func = crud_func
        self.limit = limit
        self.offset = offset

    async def execute(self):
        try:
            return await self.crud_func(limit=self.limit, offset=self.offset)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e
