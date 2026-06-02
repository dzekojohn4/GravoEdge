"""
GravoEdge Collateral Manager Module

This module provides the collateral management abstraction layer for the GravoEdge protocol.
It handles collateral factor calculations, health ratio monitoring, liquidation checks,
and position management across different Stellar ecosystem protocols.

This replaces the former Starknet-specific collateral management logic.
"""

from dataclasses import dataclass
from decimal import Decimal
from typing import Dict, List, Optional, Set, Tuple


@dataclass(frozen=True)
class CollateralConfig:
    """Configuration for a collateral asset."""
    symbol: str
    address: str
    decimals: int
    collateral_factor: Decimal
    borrow_factor: Decimal
    liquidation_threshold: Decimal
    liquidation_bonus: Decimal
    is_active: bool


@dataclass
class PositionHealth:
    """Health metrics for a leveraged position."""
    total_collateral_value: Decimal
    total_borrow_value: Decimal
    health_ratio: Decimal
    liquidation_price: Decimal
    is_underwater: bool
    max_withdrawable: Decimal
    max_borrowable: Decimal


class CollateralManager:
    """
    Manages collateral operations for GravoEdge positions.
    
    Handles:
    - Collateral factor lookups
    - Health ratio calculations
    - Liquidation threshold monitoring
    - Position valuation
    """

    SUPPORTED_TOKENS: Dict[str, CollateralConfig] = {
        "XLM": CollateralConfig(
            symbol="XLM",
            address="native",
            decimals=7,
            collateral_factor=Decimal("0.80"),
            borrow_factor=Decimal("1"),
            liquidation_threshold=Decimal("0.85"),
            liquidation_bonus=Decimal("0.05"),
            is_active=True,
        ),
        "USDC": CollateralConfig(
            symbol="USDC",
            address="TODO: Stellar USDC asset address",
            decimals=7,
            collateral_factor=Decimal("0.85"),
            borrow_factor=Decimal("1"),
            liquidation_threshold=Decimal("0.90"),
            liquidation_bonus=Decimal("0.05"),
            is_active=True,
        ),
        "ETH": CollateralConfig(
            symbol="ETH",
            address="TODO: Stellar ETH asset address",
            decimals=7,
            collateral_factor=Decimal("0.80"),
            borrow_factor=Decimal("1"),
            liquidation_threshold=Decimal("0.85"),
            liquidation_bonus=Decimal("0.05"),
            is_active=True,
        ),
    }

    @classmethod
    def get_collateral_config(cls, token_symbol: str) -> CollateralConfig:
        """
        Get the collateral configuration for a token.
        
        Args:
            token_symbol: Token symbol (e.g., "XLM", "USDC")
            
        Returns:
            CollateralConfig for the token
            
        Raises:
            ValueError: If token is not supported
        """
        if token_symbol not in cls.SUPPORTED_TOKENS:
            raise ValueError(f"Unsupported collateral token: {token_symbol}")
        return cls.SUPPORTED_TOKENS[token_symbol]

    @classmethod
    def calculate_health_ratio(
        cls,
        collateral_value: Decimal,
        borrowed_value: Decimal,
        collateral_factor: Decimal,
    ) -> Decimal:
        """
        Calculate the health ratio for a position.
        
        Health Ratio = (Collateral Value * Collateral Factor) / Borrowed Value
        
        Args:
            collateral_value: Total collateral value
            borrowed_value: Total borrowed value
            collateral_factor: The protocol's collateral factor
            
        Returns:
            Health ratio as a Decimal (values > 1 are healthy)
        """
        if borrowed_value == Decimal("0"):
            return Decimal("100")  # No debt = perfect health
        
        return (collateral_value * collateral_factor) / borrowed_value

    @classmethod
    def calculate_liquidation_price(
        cls,
        borrowed_value: Decimal,
        collateral_amount: Decimal,
        liquidation_threshold: Decimal,
    ) -> Decimal:
        """
        Calculate the liquidation price for a position.
        
        Args:
            borrowed_value: Total borrowed value
            collateral_amount: Amount of collateral
            liquidation_threshold: The liquidation threshold
            
        Returns:
            Price at which liquidation occurs
        """
        if collateral_amount == Decimal("0"):
            return Decimal("0")
        
        return borrowed_value / (collateral_amount * liquidation_threshold)

    @classmethod
    def calculate_max_leverage(
        cls, collateral_factor: Decimal, borrow_factor: Decimal
    ) -> Decimal:
        """
        Calculate the maximum achievable leverage.
        
        Args:
            collateral_factor: The protocol's collateral factor
            borrow_factor: The protocol's borrow factor
            
        Returns:
            Maximum leverage multiplier
        """
        if collateral_factor == Decimal("0"):
            return Decimal("1")
        
        effective_factor = collateral_factor * borrow_factor
        return Decimal("1") / (Decimal("1") - effective_factor)

    @classmethod
    def get_available_tokens(cls) -> List[str]:
        """Get list of supported collateral token symbols."""
        return list(cls.SUPPORTED_TOKENS.keys())

    @classmethod
    def is_liquidatable(cls, health_ratio: Decimal) -> bool:
        """
        Check if a position is subject to liquidation.
        
        Args:
            health_ratio: The position's health ratio
            
        Returns:
            True if health ratio <= 1
        """
        return health_ratio <= Decimal("1")
