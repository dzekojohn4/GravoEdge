from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class PoolResponse(BaseModel):
    """
    Pydantic model for pool response.
    """
    id: UUID
    token_a: str
    token_b: str
    liquidity: Decimal
    fee: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
