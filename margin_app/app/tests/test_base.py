import pytest

@pytest.fixture
def sample_data():
    return {"key": "value"}

def test_sample(sample_data):
    assert sample_data["key"] == "value"
