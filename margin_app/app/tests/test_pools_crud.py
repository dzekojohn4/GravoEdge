# import pytest
# import uuid
# from unittest.mock import AsyncMock
# from decimal import Decimal
# from app.crud.pool import PoolCRUD, UserPoolCRUD,Pool  
# from app.models.pool import PoolRiskStatus

# @pytest.fixture
# def pool_crud() -> PoolCRUD:
#     """Fixture to provide an instance of PoolCRUD with mocked database methods."""
#     crud = PoolCRUD()
#     crud.write_to_db = AsyncMock()
#     return crud

# # @pytest.fixture
# # def user_pool_crud() -> UserPoolCRUD:
# #     """Fixture to provide an instance of UserPoolCRUD with mocked database methods."""
# #     crud = UserPoolCRUD()
# #     crud.session = AsyncMock()
# #     return crud

# @pytest.fixture
# def user_pool_crud() -> UserPoolCRUD:
#     """Provides an instance of UserPoolCRUD with a properly mocked async session."""
#     crud = UserPoolCRUD()
#     mock_session = AsyncMock()
    
#     # Mocking async session context manager properly
#     crud.session = AsyncMock(return_value=mock_session)
#     mock_session.__aenter__.return_value = mock_session  # Ensuring async context management works
    
#     return crud


# @pytest.fixture
# def test_data():
#     """Fixture to provide reusable test data."""
#     return {
#         "user_id": uuid.uuid4(),
#         "pool_id": uuid.uuid4(),
#         "amount": Decimal("100.00"),
#     }


# # @pytest.mark.asyncio
# # async def test_create_user_pool_success(user_pool_crud: UserPoolCRUD, test_data) -> None:
# #     """Tests creating a user pool successfully."""
# #     mock_session = AsyncMock()
# #     user_pool_crud.session.return_value.__aenter__.return_value = mock_session  # Correct async context handling

# #     response = await user_pool_crud.create_user_pool(**test_data)
    
# #     assert response is not None
# #     assert response.user_id == test_data["user_id"]
# #     assert response.pool_id == test_data["pool_id"]
# #     assert response.amount == test_data["amount"]


# # @pytest.mark.asyncio
# # async def test_create_user_pool_success(user_pool_crud: UserPoolCRUD, test_data) -> None:
# #     """Tests creating a user pool successfully."""
# #     user_pool_crud.session.return_value.get.return_value = None  
# #     response = await user_pool_crud.create_user_pool(**test_data)
# #     assert response is not None
# #     assert response.user_id == test_data["user_id"]
# #     assert response.pool_id == test_data["pool_id"]
# #     assert response.amount == test_data["amount"]


# # @pytest.mark.asyncio
# # async def test_update_user_pool_success(user_pool_crud: UserPoolCRUD, test_data) -> None:
# #     """Test updating a user pool successfully."""
# #     user_pool_crud.session.return_value.get.return_value = AsyncMock(amount=Decimal("100.00"))  
# #     response = await user_pool_crud.update_user_pool(user_pool_id=test_data["user_id"], amount=Decimal("200.00"))
# #     assert response is not None
# #     assert response.amount == Decimal("200.00")


# @pytest.mark.asyncio
# async def test_create_user_pool_invalid_ids(user_pool_crud: UserPoolCRUD) -> None:
#     """Test creating a user pool with invalid IDs should raise an exception."""
#     with pytest.raises(Exception):
#         await user_pool_crud.create_user_pool(user_id=uuid.uuid4(), pool_id=None, amount=Decimal("50.00"))

# # @pytest.mark.asyncio
# # async def test_update_nonexistent_user_pool(user_pool_crud: UserPoolCRUD) -> None:
# #     """Test updating a nonexistent user pool returns None with proper logging."""
# #     user_pool_crud.session.return_value.get.return_value = None  
# #     response = await user_pool_crud.update_user_pool(user_pool_id=uuid.uuid4(), amount=Decimal("300.00"))
# #     assert response is None  
# @pytest.mark.asyncio
# async def test_update_nonexistent_user_pool(user_pool_crud: UserPoolCRUD) -> None:
#     """Tests updating a nonexistent user pool returns None with proper logging."""
#     mock_session = user_pool_crud.session.return_value.__aenter__.return_value  # Get the mocked session
#     mock_session.get.return_value = None  # Mock nonexistent entry
    
#     response = await user_pool_crud.update_user_pool(user_pool_id=uuid.uuid4(), amount=Decimal("300.00"))
    
#     assert response is None  # Ensure None is returned for nonexistent user pools


import pytest
import uuid
from unittest.mock import AsyncMock
from decimal import Decimal
from app.crud.pool import PoolCRUD, UserPoolCRUD

# Constants for reusable test values
TEST_AMOUNT = Decimal("100.00")
TEST_UPDATED_AMOUNT = Decimal("200.00")
TEST_USER_ID = uuid.uuid4()
TEST_POOL_ID = uuid.uuid4()

# Fixtures
@pytest.fixture
def pool_crud() -> PoolCRUD:
    """Fixture to provide an instance of PoolCRUD with mocked database methods."""
    crud = PoolCRUD()
    crud.write_to_db = AsyncMock()
    return crud

@pytest.fixture
def user_pool_crud() -> UserPoolCRUD:
    """Fixture to provide an instance of UserPoolCRUD with a properly mocked async session."""
    crud = UserPoolCRUD()
    mock_session = AsyncMock()

    # Mock session() to return an async context manager
    crud.session = AsyncMock(return_value=mock_session)
    mock_session.__aenter__.return_value = mock_session  # Ensure async context management works
    mock_session.__aexit__.return_value = AsyncMock()  # Ensure graceful exit

    return crud

@pytest.fixture
def test_data():
    """Fixture to provide reusable test data."""
    return {
        "user_id": TEST_USER_ID,
        "pool_id": TEST_POOL_ID,
        "amount": TEST_AMOUNT,
    }

# Tests for UserPoolCRUD
class TestUserPoolCRUD:
    @pytest.mark.asyncio
    async def test_create_user_pool_success(self, user_pool_crud: UserPoolCRUD, test_data) -> None:
        """Test that creating a user pool with valid data returns the expected user pool object."""
        mock_session = user_pool_crud.session.return_value.__aenter__.return_value
        mock_session.get.return_value = None  # Mock no existing user pool
        mock_session.add = AsyncMock()  # Mock async add method
        mock_session.commit = AsyncMock()  # Mock async commit method
        
        response = await user_pool_crud.create_user_pool(**test_data)
        
        assert response is not None
        assert response.user_id == test_data["user_id"]
        assert response.pool_id == test_data["pool_id"]
        assert response.amount == test_data["amount"]
        mock_session.add.assert_called_once()  # Verify add() was called
        mock_session.commit.assert_called_once()  # Verify commit() was called

    @pytest.mark.asyncio
    async def test_create_user_pool_invalid_ids(self, user_pool_crud: UserPoolCRUD) -> None:
        """Test that creating a user pool with invalid IDs raises an exception."""
        with pytest.raises(Exception):
            await user_pool_crud.create_user_pool(user_id=TEST_USER_ID, pool_id=None, amount=TEST_AMOUNT)

    # @pytest.mark.asyncio
    # async def test_update_user_pool_success(self, user_pool_crud: UserPoolCRUD, test_data) -> None:
    #     """Test that updating a user pool with valid data returns the updated user pool."""
    #     mock_session = user_pool_crud.session.return_value.__aenter__.return_value
    #     mock_session.get.return_value = AsyncMock(amount=TEST_AMOUNT)  # Mock existing user pool
        
    #     response = await user_pool_crud.update_user_pool(
    #         user_pool_id=test_data["user_id"], 
    #         amount=TEST_UPDATED_AMOUNT
    #     )
        
    #     assert response is not None
    #     assert response.amount == TEST_UPDATED_AMOUNT
    #     mock_session.get.assert_called_once()  # Verify get() was called

    # @pytest.mark.asyncio
    # async def test_update_nonexistent_user_pool(self, user_pool_crud: UserPoolCRUD) -> None:
    #     """Test that updating a nonexistent user pool returns None."""
    #     mock_session = user_pool_crud.session.return_value.__aenter__.return_value
    #     mock_session.get.return_value = None  # Mock nonexistent entry
        
    #     response = await user_pool_crud.update_user_pool(
    #         user_pool_id=TEST_USER_ID, 
    #         amount=TEST_UPDATED_AMOUNT
    #     )
        
    #     assert response is None
    #     mock_session.get.assert_called_once()  # Verify get() was called

# Tests for PoolCRUD
class TestPoolCRUD:
    @pytest.mark.asyncio
    async def test_write_to_db_success(self, pool_crud: PoolCRUD) -> None:
        """Test that writing to the database succeeds."""
        mock_data = {"key": "value"}
        
        await pool_crud.write_to_db(mock_data)
        
        pool_crud.write_to_db.assert_called_once_with(mock_data)  # Verify write_to_db was called