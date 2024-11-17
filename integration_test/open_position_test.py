import pytest
from fastapi.testclient import TestClient
from web_app.api.main import app

client = TestClient(app)


def get_app_stats() -> dict:
    """
    Simulate fetching application stats via the `get_stats` API.

    Returns:
        dict: Application stats response.
    """
    response = client.get("/api/get-stats")
    assert response.status_code == 200, "Failed to fetch app stats"
    return response.json()


def get_token_multipliers() -> dict:
    """
    Simulate fetching token multipliers via the `get_multipliers` API.

    Returns:
        dict: Token multipliers response.
    """
    response = client.get("/api/get-multipliers")
    assert response.status_code == 200, "Failed to fetch token multipliers"
    return response.json()


def create_position(
    wallet_id: str, token_symbol: str, amount: float, multiplier: float
) -> str:
    """
    Simulate creating a position using the `create_position` API.

    Args:
        wallet_id (str): User's wallet ID.
        token_symbol (str): Token symbol (ETH, USDC, STRK, DAI).
        amount (float): Token amount to deposit.
        multiplier (float): Position multiplier.

    Returns:
        str: Created position ID.
    """
    payload = {
        "wallet_id": wallet_id,
        "token_symbol": token_symbol,
        "amount": amount,
        "multiplier": multiplier,
    }
    response = client.post("/api/create-position", json=payload)
    assert response.status_code == 200, "Failed to create position"
    data = response.json()
    assert "position_id" in data, "Position ID missing in create response"
    assert (
        data["position_status"] == "pending"
    ), "Position should be in 'pending' state after creation"
    return data["position_id"]


def open_position(position_id: str) -> str:
    """
    Simulate opening a position using the `open_position` API.

    Args:
        position_id (str): ID of the position to open.

    Returns:
        str: API response status.
    """
    url = f"/api/open-position?position_id={position_id}"
    response = client.get(url)
    assert response.status_code == 200, "Failed to open position"
    status = response.json()
    assert status == "opened", f"Expected position status to be 'opened', got {status}"
    return status


@pytest.mark.parametrize(
    "wallet_id, token_symbol, amount, multiplier",
    [
        ("wallet_1", "ETH", 0.5, 3.0),
        ("wallet_2", "USDC", 10.0, 2.5),
        ("wallet_3", "STRK", 1.0, 1.5),
        ("wallet_4", "DAI", 5.0, 2.0),
    ],
)
def test_full_open_position_flow(wallet_id, token_symbol, amount, multiplier):
    """
    Integration test for the full workflow of opening a position:
    - Fetch app stats.
    - Get multipliers for tokens.
    - Create a position.
    - Open the created position.
    - Verify position opening via `get_stats`.

    Args:
        wallet_id (str): Test wallet ID.
        token_symbol (str): Token to be used.
        amount (float): Amount of token.
        multiplier (float): Multiplier for the position.

    Returns:
        None
    """
    # Get App Stats before position creation
    initial_opened_amount = get_app_stats().get("total_opened_amount", 0)

    # Get Token Multipliers
    token_multipliers = get_token_multipliers()
    assert (
        token_symbol in token_multipliers["multipliers"]
    ), f"Multiplier for {token_symbol} not found"
    multiplier_range = token_multipliers["multipliers"][token_symbol]
    assert multiplier <= multiplier_range, f"Multiplier {multiplier} exceeds range"

    # Create a Position
    position_id = create_position(wallet_id, token_symbol, amount, multiplier)
    print(f"Position created with ID: {position_id}")

    # Open the Created Position
    open_status = open_position(position_id)
    assert open_status == "opened", f"Unexpected open status: {open_status}"
    print(f"Position {position_id} opened successfully")

    # Get App Stats after position opening and verify
    updated_stats = get_app_stats()
    updated_opened_amount = updated_stats.get("total_opened_amount", 0)
    assert (
        updated_opened_amount > initial_opened_amount
    ), "The opened amount did not increase as expected"
