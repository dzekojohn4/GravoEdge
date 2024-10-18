import httpx
import pytest

async_client = httpx.AsyncClient(base_url="http://localhost:8000")


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


@pytest.mark.asyncio
async def get_user_contract_address_test():
    async with async_client as ac:
        response = await ac.get("/api/get-user-contract-address")
    assert response.status_code == 200
