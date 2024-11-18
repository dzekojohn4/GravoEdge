import pytest
from fastapi.testclient import TestClient
from typing import Dict, Any
from datetime import datetime
from web_app.api.main import app
from web_app.db.crud import PositionDBConnector
from web_app.contract_tools.mixins.deposit import DepositMixin
from web_app.contract_tools.mixins.dashboard import DashboardMixin
from web_app.db.models import Position

client = TestClient(app)
position_db = PositionDBConnector()

class PositionCreationTest:
    """
    Integration test for creating and managing positions.

    Steps:
    1. Fetch transaction data using `DepositMixin.get_transaction_data`.
    2. Create a position using `PositionDBConnector`.
    3. Verify the created position's attributes.
    4. Fetch current token prices using `DashboardMixin`.
    5. Update position status and validate changes.
    """


    mock_position_data: Dict[str, Any] = {
        "wallet_id": "0x011F0c180b9EbB2B3F9601c41d65AcA110E48aec0292c778f41Ae286C78Cc374",
        "token_symbol": "STRK",
        "amount": "2",
        "multiplier": 1,
        "borrowing_token": "STRK",
    }

    @pytest.fixture
    def setup_mock_user(self) -> Dict[str, Any]:
        """
        Create a mock user and position data for testing.

        Returns:
            Dict[str, Any]: A dictionary containing position data.
        """
        position_data= self.mock_position_data
        return {"position_data": position_data}

    def test_create_position(self, setup_mock_user: Dict[str, Any]) -> Position:
        """
        Test creating a position and validating attributes.

        Args:
            setup_mock_user (Dict[str, Any]): position data.

        Returns:
            Position
        """

        transaction_data = DepositMixin.get_transaction_data(
            deposit_token=setup_mock_user["position_data"]["token_symbol"],
            amount=setup_mock_user["position_data"]["amount"],
            multiplier=setup_mock_user["position_data"]["multiplier"],
            wallet_id=setup_mock_user["user"]["wallet_id"],
            borrowing_token=setup_mock_user["position_data"]["borrowing_token"],
        )
        assert "caller" in transaction_data, "Transaction data missing 'caller'"
        assert transaction_data["caller"] == setup_mock_user["user"]["wallet_id"], "Mismatch in 'caller'"
        assert "pool_price" in transaction_data, "'pool_price' missing in transaction data"
        assert "pool_key" in transaction_data, "'pool_key' missing in transaction data"
        assert "deposit_data" in transaction_data, "'deposit_data' missing in transaction data"
    
        position = position_db.create_position(
            wallet_id=setup_mock_user["user"]["wallet_id"],
            token_symbol=setup_mock_user["position_data"]["token_symbol"],
            amount=setup_mock_user["position_data"]["amount"],
            multiplier=setup_mock_user["position_data"]["multiplier"],
        )
        assert position.status == "pending", "Position status should be 'pending' upon creation"

        current_prices = DashboardMixin.get_current_prices()
        assert position.token_symbol in current_prices, "Token price missing in current prices"
        position.start_price = current_prices[position.token_symbol]
        position.created_at = datetime.utcnow()

        position_db.update_position(position, position.amount, position.multiplier)

        print(f"Position {position.id} created successfully with status '{position.status}'.")
        return position

    def test_open_position(self, position_id : str) -> None:
        """
        Test opening a position and validating status updates.

        Args:
            position id : str

        Returns:
            None
        """
        response = client.get(f"/api/open-position?position_id={position_id}")
        assert response.status_code == 200, "Opening position failed"
        assert response.json().get("status") == "opened", "Position status mismatch after opening"

        print(f"Position {position_id} successfully opened.")

    def test_full_workflow(self) -> None:
        """
        Comprehensive test for the position workflow.

        Returns:
            None
        """
        position = self.test_create_position(self.setup_mock_user)

        self.test_open_position(position.id)
