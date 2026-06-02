import {
  requestAccess,
  isConnected,
  getPublicKey,
} from '@stellar/freighter-api';
import {
  connectWallet,
  getTokenBalances,
  getBalances,
  logout,
  getWalletPublicKey,
  isFreighterInstalled,
} from '../../src/services/wallet';

import { XLM_ASSET, USDC_ASSET } from '../../src/utils/constants';
import { expect, describe, it, beforeEach, vi } from 'vitest';

vi.mock('@stellar/freighter-api', () => ({
  requestAccess: vi.fn(),
  isConnected: vi.fn(),
  getPublicKey: vi.fn(),
  signTransaction: vi.fn(),
}));

vi.mock('@stellar/stellar-sdk', () => ({
  StrKey: {
    isValidEd25519PublicKey: vi.fn().mockReturnValue(true),
  },
}));

describe('Wallet Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('connectWallet', () => {
    it('should successfully connect wallet and return public key', async () => {
      const mockPublicKey = 'GA7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2';

      // Mock isConnected to check Freighter availability
      window.freighter = { isConnected: true };
      requestAccess.mockResolvedValue(mockPublicKey);

      const result = await connectWallet();

      expect(requestAccess).toHaveBeenCalled();
      expect(result).toBe(mockPublicKey);
    });

    it('should throw error when Freighter is not installed', async () => {
      window.freighter = undefined;
      isConnected.mockReturnValue(false);

      await expect(connectWallet()).rejects.toThrow(
        'Freighter wallet is not installed'
      );
    });

    it('should throw error when connection fails', async () => {
      window.freighter = { isConnected: true };
      requestAccess.mockResolvedValue(null);

      await expect(connectWallet()).rejects.toThrow('Invalid Stellar public key');
    });

    it('should throw error when requestAccess throws', async () => {
      window.freighter = { isConnected: true };
      requestAccess.mockRejectedValue(new Error('User rejected connection'));

      await expect(connectWallet()).rejects.toThrow('User rejected connection');
    });
  });

  describe('logout', () => {
    it('should clear wallet ID from local storage', async () => {
      const mockRemoveItem = vi.fn();
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: mockRemoveItem,
        },
        writable: true,
      });

      await logout();

      expect(mockRemoveItem).toHaveBeenCalledWith('wallet_id');
      expect(mockRemoveItem).toHaveBeenCalledWith('gravoedge_last_connected_wallet');
    });
  });

  describe('getWalletPublicKey', () => {
    it('should return public key when wallet is connected', async () => {
      const mockPublicKey = 'GA7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2';
      isConnected.mockResolvedValue(true);
      getPublicKey.mockResolvedValue(mockPublicKey);

      const result = await getWalletPublicKey();
      expect(result).toBe(mockPublicKey);
    });

    it('should return null when wallet is not connected', async () => {
      isConnected.mockResolvedValue(false);

      const result = await getWalletPublicKey();
      expect(result).toBeNull();
    });
  });

  describe('getTokenBalances', () => {
    it('should return balances from Stellar Horizon', async () => {
      const mockPublicKey = 'GA7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2';

      // Mock the dynamic import of @stellar/stellar-sdk Server
      const mockServer = {
        loadAccount: vi.fn().mockResolvedValue({
          balances: [
            { asset_type: 'native', balance: '100.5000000' },
            {
              asset_type: 'credit_alphanum4',
              asset_code: 'USDC',
              asset_issuer: USDC_ASSET.issuer,
              balance: '50.0000000',
            },
          ],
        }),
      };

      const stellarSdkMock = {
        Server: vi.fn().mockImplementation(() => mockServer),
      };

      vi.doMock('@stellar/stellar-sdk', () => stellarSdkMock);

      // Re-import to get mocked version
      const { getTokenBalances: getMockedBalances } = await import('../../src/services/wallet');

      const balances = await getMockedBalances(mockPublicKey);

      expect(balances).toEqual({
        XLM: '100.5000',
        USDC: '50.0000',
      });
    });

    it('should return zeros if account does not exist', async () => {
      const mockPublicKey = 'GA7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2';

      const mockServer = {
        loadAccount: vi.fn().mockRejectedValue(new Error('Account not found')),
      };

      const stellarSdkMock = {
        Server: vi.fn().mockImplementation(() => mockServer),
      };

      vi.doMock('@stellar/stellar-sdk', () => stellarSdkMock);

      const { getTokenBalances: getMockedBalances } = await import('../../src/services/wallet');

      const balances = await getMockedBalances(mockPublicKey);
      expect(balances).toEqual({ XLM: '0.0000', USDC: '0.0000' });
    });
  });
});
