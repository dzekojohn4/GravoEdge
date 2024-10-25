from unittest.mock import AsyncMock, patch

import pytest
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from httpx import AsyncClient
from web_app.api.dashboard import router

app = FastAPI()
app.include_router(router)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


@pytest.mark.asyncio
async def test_get_dashboard_success():
    wallet_id = "0x1234567890abcdef"

    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_zklend_position",
        new_callable=AsyncMock,
    ) as mock_get_zklend_position:

        # mock return values
        mock_get_contract_address_by_wallet_id.return_value = "0xabcdef1234567890"
        mock_get_positions_by_wallet_id.return_value = [
            {
                "multiplier": 1,
                "created_at": "2024-01-01T00:00:00",
            }
        ]
        mock_get_wallet_balances.return_value = {"ETH": 5.0, "USDC": 1000.0}
        mock_get_zklend_position.return_value = {
            "products": [
                {
                    "name": "ZkLend",
                    "groups": {"1": {"healthRatio": "1.2"}},
                    "positions": [],
                }
            ]
        }

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.status_code == 200
        data = response.json()
        assert data == {
            "balances": {"ETH": 5.0, "USDC": 1000.0},
            "multipliers": {"ETH": 1},
            "start_dates": {"ETH": "2024-01-01T00:00:00"},
            "zklend_position": {
                "products": [{"name": "ZkLend", "health_ratio": "1.2", "positions": []}]
            },
        }


@pytest.mark.asyncio
async def test_get_dashboard_no_positions():
    wallet_id = "0x1234567890abcdef"

    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_zklend_position",
        new_callable=AsyncMock,
    ) as mock_get_zklend_position:

        # mock return values
        mock_get_contract_address_by_wallet_id.return_value = "0xabcdef1234567890"
        mock_get_positions_by_wallet_id.return_value = []
        mock_get_wallet_balances.return_value = {"ETH": 5.0, "USDC": 1000.0}
        mock_get_zklend_position.return_value = {"products": []}

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["multipliers"] == {"ETH": None}
        assert data["start_dates"] == {"ETH": None}


@pytest.mark.asyncio
async def test_get_dashboard_invalid_wallet_id():
    wallet_id = "invalid_wallet_id"

    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id:
        # Simulate exception when invalid wallet_id is used
        mock_get_contract_address_by_wallet_id.side_effect = Exception(
            "Invalid wallet ID"
        )

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.status_code == 500
        data = response.json()
        assert data["detail"] == "Internal Server Error"


@pytest.mark.asyncio
async def test_get_dashboard_no_contract_address():
    wallet_id = "0x1234567890abcdef"

    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_zklend_position",
        new_callable=AsyncMock,
    ) as mock_get_zklend_position:

        mock_get_contract_address_by_wallet_id.return_value = None
        mock_get_positions_by_wallet_id.return_value = []
        mock_get_wallet_balances.return_value = {"ETH": 5.0, "USDC": 1000.0}
        mock_get_zklend_position.return_value = {"products": []}

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["multipliers"] == {"ETH": None}
        assert data["start_dates"] == {"ETH": None}


@pytest.mark.asyncio
async def test_get_dashboard_zklend_position_failure():
    wallet_id = "0x1234567890abcdef"

    with patch(
        "web_app.api.dashboard.position_db_connector.get_contract_address_by_wallet_id"
    ) as mock_get_contract_address_by_wallet_id, patch(
        "web_app.api.dashboard.position_db_connector.get_positions_by_wallet_id"
    ) as mock_get_positions_by_wallet_id, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_wallet_balances",
        new_callable=AsyncMock,
    ) as mock_get_wallet_balances, patch(
        "web_app.contract_tools.mixins.dashboard.DashboardMixin.get_zklend_position",
        new_callable=AsyncMock,
    ) as mock_get_zklend_position:

        mock_get_contract_address_by_wallet_id.return_value = "0xabcdef1234567890"
        mock_get_positions_by_wallet_id.return_value = [
            {
                "multiplier": 1,
                "created_at": "2024-01-01T00:00:00",
            }
        ]
        mock_get_wallet_balances.return_value = {"ETH": 5.0, "USDC": 1000.0}
        mock_get_zklend_position.side_effect = Exception("External API failure")

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get(f"/api/dashboard?wallet_id={wallet_id}")

        assert response.status_code == 500
        data = response.json()
        assert data["detail"] == "Internal Server Error"
