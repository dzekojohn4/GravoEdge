import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from web_app import app
from web_app.db.models import User


@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


@pytest.mark.asyncio
async def test_create_referal_link_success(client):
    with patch("web_app.db.database.get_db") as mock_get_db:
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        mock_user = MagicMock(spec=User)
        mock_user.wallet_id = "wallet123"
        mock_db.query().filter().first.return_value = mock_user
        response = client.get('/api/create_referal_link?wallet_id=wallet123')
        assert response.status_code == 200
        data = response.json()
        assert data['wallet_id'] == 'wallet123'
        assert len(data['referral_code']) == 16



@pytest.mark.asyncio
async def test_create_referal_link_missing_wallet_id(client):
    response = client.get('/api/create_referal_link')
    assert response.status_code == 422
    data = response.json()
    assert data['detail'][0]['msg'] == "field required"



@pytest.mark.asyncio
async def test_create_referal_link_user_not_found(client):

    with patch("web_app.db.database.get_db") as mock_get_db:
        mock_db = MagicMock()
        mock_get_db.return_value = mock_db
        mock_db.query().filter().first.return_value = None
        response = client.get('/api/create_referal_link?wallet_id=wallet789')
        assert response.status_code == 404
        data = response.json()
        assert data['detail'] == 'User with the provided wallet_id does not exist'
