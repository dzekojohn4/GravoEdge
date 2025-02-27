from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class MarginPositionStatus(str, Enum):
    """
    Enumeration of possible margin position statuses.

    Attributes:
        OPEN: Position is currently open
        CLOSED: Position has been closed
    """

    OPEN = "Open"
    CLOSED = "Closed"


class CloseMarginPositionResponse(BaseModel):
    """
    Response model for closing a margin position.

    Attributes:
        position_id (UUID): The unique identifier of the margin position
        status (MarginPositionStatus): The current status of the margin position
    """

    position_id: UUID
    status: MarginPositionStatus

    class Config:
        """Pydantic configuration class"""

        from_attributes = True
