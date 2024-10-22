import pytest

from fastapi.testclient import TestClient

from web_app.api.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app=app) as client:
        yield client
