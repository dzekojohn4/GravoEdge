import pytest
from fastapi.testclient import TestClient
from web_app.api.main import app

client = TestClient(app)

TEST_WALLET_ID: str = "test_wallet_id"


@pytest.fixture
def create_position() -> str:
    """
    Fixture to create a position before the 'open position' test.

    Returns:
        str: The position_id of the newly created position.
    """
    position_payload = {
        "wallet_id": TEST_WALLET_ID,
        "token_symbol": "STRK",
        "amount": "2",
        "multiplier": 1.0,
    }
    response = client.post("/api/create-position", json=position_payload)
    assert response.status_code == 200, "Failed to create position"

    position_data = response.json()
    assert "position_id" in position_data, "Position ID missing in create response"

    return position_data["position_id"]


def test_open_position(create_position: str) -> None:
    """
    Test the /api/open-position endpoint after creating a position.

    Args:
        create_position (str): The position_id of the created position from the fixture.

    Returns:
        None
    """
    position_id: str = create_position

    open_position_url: str = f"/api/open-position?position_id={position_id}"
    response = client.get(open_position_url)
    assert response.status_code == 200, "Failed to open position"
