"""
This module defines the serializers for the position data.
"""

from pydantic import BaseModel, field_validator


class PositionFormData(BaseModel):
    """
    Pydantic model for the form data
    """

    wallet_id: str
    token_symbol: str
    amount: str
    multiplier: float

    @field_validator("multiplier", mode="before")
    def validate_multiplier(cls, value: str) -> float:
        """
        Validate the multiplier value
        :param value: int
        :return: int
        """
        try:
            return float(value)
        except (ValueError, TypeError):
            raise Exception("Multiplier should be an integer")
