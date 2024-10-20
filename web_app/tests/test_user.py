import httpx
import pytest

from web_app.api.serializers.transaction import UpdateUserContractRequest


@pytest.fixture(scope="function")
async def async_client():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        yield client


@pytest.mark.asyncio
async def test_get_empty_user_contract(async_client):
    """
    Test get_user_contract endpoint, where wallet_id = ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    response = await async_client.get(
        url="/api/get-user-contract",
        params={
            "wallet_id": "",
        },
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, str)
    assert response_json == ""


@pytest.mark.asyncio
async def test_check_empty_user(async_client):
    """
    Test check_user endpoint, where wallet_id = ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    response = await async_client.get(
        url="/api/check-user",
        params={
            "wallet_id": "",
        },
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, dict)
    assert "is_contract_deployed" in response_json
    assert isinstance(response_json["is_contract_deployed"], bool)


@pytest.mark.asyncio
async def test_change_empty_user_contract(async_client):
    """
    Test get_user_contract endpoint,
    where wallet_id = "" and contract_address = ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    data = UpdateUserContractRequest(
        wallet_id="",
        contract_address="",
    )

    response = await async_client.post(
        url="/api/update-user-contract",
        json=data.dict(),
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, dict)
    assert "is_contract_deployed" in response_json
    assert response_json["is_contract_deployed"]


@pytest.mark.asyncio
async def test_get_empty_user_contract_address(async_client):
    """
    Test get_user_contract_address endpoint, where wallet_id = ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    response = await async_client.get(
        url="/api/get-user-contract-address",
        params={
            "wallet_id": "",
        },
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, dict)
    assert "contract_address" in response_json
    assert not response_json["contract_address"]
