"""
Unit tests for Admin API endpoints using function-based approach without async/await.
"""

import uuid
from unittest.mock import patch, AsyncMock

import pytest

ADMIN_URL = "/api/admin/"


@pytest.fixture
def mock_get_all_admin():
    """
    Mock the get_all method of crud_get_all.
    """
    with patch("app.crud.admin.AdminCRUD.get_all", new_callable=AsyncMock) as mock:
        yield mock


@pytest.mark.parametrize(
    'limit, offset',
    [
        (5, 0),
        (5, 5),
        (5, 10),
    ]
)
def test_get_all_admins(client, mock_get_all_admin, limit, offset):
    """Test successfully return all admins with limit and offset applied."""
    admins = []
    for i in range(10):
        admins.append({
            "name": f"name{str(i)}",
            "id": str(uuid.uuid4()),
            "email": f"email{str(i)}@mail.ru",
        })

    mock_get_all_admin.return_value = admins[:3]
    response = client.get(ADMIN_URL + "all" + f"?limit={limit}&offset={offset}")
    assert response.status_code == 200
    assert response.json() == admins[:3]
