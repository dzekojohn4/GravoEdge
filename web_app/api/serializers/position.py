from pydantic import BaseModel, validator


class PositionFormData(BaseModel):
    """
    Pydantic model for the form data
    """

    wallet_id: str
    token_symbol: str
    amount: str
    multiplier: int

    @validator("multiplier")
    def validate_multiplier(cls, value: int) -> int:
        """
        Validate the multiplier value
        :param value: int
        :return: int
        """
        try:
            return int(value)
        except ValueError:
            raise ValueError("Multiplier should be an integer")
