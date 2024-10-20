import httpx
import pytest

from web_app.api.serializers.transaction import UpdateUserContractRequest


@pytest.fixture(scope="function")
async def async_client():
    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        yield client


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, expected_contract_address",
    [
        ("", ""),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
    ],
)
async def test_get_user_contract(
    async_client, wallet_id: str, expected_contract_address: str
):
    """
    Test get_user_contract endpoint,
    where wallet_id = "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49" or ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    response = await async_client.get(
        url="/api/get-user-contract",
        params={
            "wallet_id": wallet_id,
        },
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, str)
    assert response_json == expected_contract_address or response_json == ""


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id",
    [
        "",
        "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
    ],
)
async def test_check_user(async_client, wallet_id: str):
    """
    Test check_user endpoint,
    where wallet_id = "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49" or ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    response = await async_client.get(
        url="/api/check-user",
        params={
            "wallet_id": wallet_id,
        },
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, dict)
    assert "is_contract_deployed" in response_json
    assert isinstance(response_json["is_contract_deployed"], bool)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "wallet_id, contract_address",
    [
        ("", ""),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
    ],
)
async def test_change_user_contract(
    async_client, wallet_id: str, contract_address: str
):
    """
    Test get_user_contract endpoint,
    where wallet_id = "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49" or ""
    and contract_address = "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0" or ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    data = UpdateUserContractRequest(
        wallet_id=wallet_id,
        contract_address=contract_address,
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
@pytest.mark.parametrize(
    "wallet_id, expected_contract_address",
    [
        ("", None),
        (
            "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49",
            "0x698b63df00be56ba39447c9b9ca576ffd0edba0526d98b3e8e4a902ffcf12f0",
        ),
    ],
)
async def test_get_user_contract_address(
    async_client, wallet_id: str, expected_contract_address: str
):
    """
    Test get_user_contract_address endpoint,
    where wallet_id = "0x27994c503bd8c32525fbdaf9d398bdd4e86757988c64581b055a06c5955ea49" or ""
    :param async_client: httpx.AsyncClient
    :return: None
    """
    response = await async_client.get(
        url="/api/get-user-contract-address",
        params={
            "wallet_id": wallet_id,
        },
    )
    response_json = response.json()

    assert response.is_success
    assert isinstance(response_json, dict)
    assert "contract_address" in response_json
    assert response_json["contract_address"] == expected_contract_address
