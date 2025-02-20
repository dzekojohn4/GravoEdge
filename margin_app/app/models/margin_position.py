from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from enum import Enum
from .base import BaseModel

class MarginPositionStatus(Enum):
    OPEN = "Open"
    CLOSED = "Closed"

class MarginPosition(BaseModel):
    __tablename__ = 'margin_positions'

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    multiplier = Column(Integer, nullable=False)
    borrowed_amount = Column(Numeric, nullable=False)
    status = Column(String, nullable=False)
    transaction_id = Column(String, nullable=False)
    liquidated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="margin_positions")

    __table_args__ = (
        CheckConstraint('multiplier >= 1 AND multiplier <= 20', name='check_multiplier_range'),
        CheckConstraint("status IN ('Open', 'Closed')", name='check_valid_status'),
    )