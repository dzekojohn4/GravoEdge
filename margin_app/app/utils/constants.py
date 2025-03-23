from enum import Enum

class EventName(Enum):
    """
    Enum class representing different types of transaction events in the margin trading system.
    
    This class defines the possible event types that can occur during margin trading operations.
    Each event represents a specific action or state change in the system.
    
    Attributes:
        open_position: Event triggered when a new trading position is opened
        close_position: Event triggered when an existing trading position is closed
        create_pool: Event triggered when a new liquidity pool is created
        close_pool: Event triggered when an existing liquidity pool is closed
        liquidated: Event triggered when a position is forcibly closed due to insufficient margin
    """
    open_position = "open_position"
    close_position = "close_position"
    create_pool = "create_pool"
    close_pool = "close_pool"
    liquidated = "liquidated"