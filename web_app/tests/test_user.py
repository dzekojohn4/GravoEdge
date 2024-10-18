import httpx
import pytest

from ..api.main import app

async_client = httpx.AsyncClient(app=app, base_url="http://test")


@pytest.mark.asyncio
async def get_user_contract_test():
    async with async_client as ac:
        response = await ac.get("/api/get-user-contract")
    assert response.status_code == 200


@pytest.mark.asyncio
async def check_user_test():
    async with async_client as ac:
        response = await ac.get("/api/check-user")
    assert response.status_code == 200


@pytest.mark.asyncio
async def change_user_contract_test():
    async with async_client as ac:
        response = await ac.post("/api/update-user-contract")
    assert response.status_code == 200


@pytest.mark.asyncion
async def get_user_contract_address_test():
    async with async_client as ac:
        response = await ac.get("/api/get-user-contract-address")
    assert response.status_code == 200
