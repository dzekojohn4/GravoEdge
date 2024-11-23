import unittest
from unittest.mock import MagicMock, patch
from decimal import Decimal
from web_app.db.crud import DepositDBConnector
from web_app.db.models import User, Vault

class TestCreateVault(unittest.TestCase):
    def setUp(self):
        self.connector = DepositDBConnector()
        self.connector.write_to_db = MagicMock()

    def test_create_vault_success(self):
        user = User(id=1)
        vault = self.connector.create_vault(user, "BTC", "1000")
        self.connector.write_to_db.assert_called_once()
        self.assertEqual(vault.user_id, user.id)
        self.assertEqual(vault.symbol, "BTC")
        self.assertEqual(vault.amount, "1000")

    def test_create_vault_db_failure(self):
        self.connector.write_to_db.side_effect = Exception("DB write failed")
        user = User(id=1)
        with self.assertRaises(Exception) as context:
            self.connector.create_vault(user, "BTC", "1000")
        self.assertIn("DB write failed", str(context.exception))



class TestGetVault(unittest.TestCase):
    def setUp(self):
        self.connector = DepositDBConnector()
        self.connector.get_object_by_field = MagicMock()

    @patch("your_module.DepositDBConnector.Session")
    def test_get_vault_success(self, mock_session):
        mock_db = mock_session.return_value.__enter__.return_value
        user = User(id=1, wallet_id="wallet_123")
        vault = Vault(user_id=1, symbol="BTC", amount="1000")
        
        self.connector.get_object_by_field.return_value = user
        mock_db.query().filter_by().first.return_value = vault

        result = self.connector.get_vault("wallet_123", "BTC")
        self.assertEqual(result, vault)

    def test_get_vault_user_not_found(self):
        self.connector.get_object_by_field.return_value = None
        result = self.connector.get_vault("invalid_wallet", "BTC")
        self.assertIsNone(result)

    @patch("your_module.DepositDBConnector.Session")
    def test_get_vault_not_found(self, mock_session):
        mock_db = mock_session.return_value.__enter__.return_value
        user = User(id=1, wallet_id="wallet_123")
        
        self.connector.get_object_by_field.return_value = user
        mock_db.query().filter_by().first.return_value = None

        result = self.connector.get_vault("wallet_123", "BTC")
        self.assertIsNone(result)


class TestAddVaultBalance(unittest.TestCase):
    def setUp(self):
        self.connector = DepositDBConnector()
        self.connector.get_vault = MagicMock()

    @patch("your_module.DepositDBConnector.Session")
    def test_add_vault_balance_success(self, mock_session):
        mock_db = mock_session.return_value.__enter__.return_value
        vault = Vault(id=1, user_id=1, symbol="BTC", amount="1000")
        self.connector.get_vault.return_value = vault

        self.connector.add_vault_balance("wallet_123", "BTC", "500")
        mock_db.query().filter_by().update.assert_called_once_with(amount="1500")
        mock_db.commit.assert_called_once()

    def test_add_vault_balance_vault_not_found(self):
        self.connector.get_vault.return_value = None
        self.connector.add_vault_balance("wallet_123", "BTC", "500")
        self.connector.get_vault.assert_called_once_with("wallet_123", "BTC")


class TestGetVaultBalance(unittest.TestCase):
    def setUp(self):
        self.connector = DepositDBConnector()
        self.connector.get_vault = MagicMock()

    def test_get_vault_balance_success(self):
        vault = Vault(user_id=1, symbol="BTC", amount="1000")
        self.connector.get_vault.return_value = vault
        result = self.connector.get_vault_balance("wallet_123", "BTC")
        self.assertEqual(result, "1000")

    def test_get_vault_balance_vault_not_found(self):
        self.connector.get_vault.return_value = None
        result = self.connector.get_vault_balance("wallet_123", "BTC")
        self.assertIsNone(result)
