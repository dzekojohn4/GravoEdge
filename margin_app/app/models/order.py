from base import BaseModel
from sqlalchemy import BIGINT, VARCHAR, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID


class Order(BaseModel):
    __tablename__ = "order"
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user.id"), primary_key=True)
    price: Mapped[float] = mapped_column(Numeric(precision=10, scale=2))
    token: Mapped[str] = mapped_column(VARCHAR)
    position: Mapped[UUID] = mapped_column(UUID(as_uuid=True))

