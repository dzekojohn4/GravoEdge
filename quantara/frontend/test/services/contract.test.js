import { getWalletPublicKey } from '../../src/services/wallet';
import { axiosInstance } from '../../src/utils/axios';
import { deployContract, checkAndDeployContract } from '../../src/services/contract';
import { getDeployContractData } from '../../src/utils/constants';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../src/services/wallet', () => ({
  getWalletPublicKey: vi.fn(),
  signStellarTransaction: vi.fn(),
  getNetworkPassphrase: vi.fn(),
  isFreighterInstalled: vi.fn(),
}));
vi.mock('../../src/utils/axios');
vi.mock('../../src/utils/constants');
vi.mock('../../src/components/layout/notifier/Notifier', () => ({
  notify: vi.fn(),
  ToastWithLink: vi.fn(),
}));

describe('Contract Deployment Tests', () => {
  const mockWalletId = 'GA7QYNF7SOWQ3GLR2ZGMH2Z5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2X2H5Y2';

  beforeEach(() => {
    vi.clearAllMocks();
    getDeployContractData.mockReturnValue({
      wasmHash: 'mockWasmHash',
    });
    vi.mocked(axiosInstance.get).mockReset();
    vi.mocked(axiosInstance.post).mockReset();
  });

  describe('deployContract', () => {
    it('should successfully initiate contract deployment', async () => {
      getWalletPublicKey.mockResolvedValue(mockWalletId);

      const result = await deployContract(mockWalletId);

      expect(getWalletPublicKey).toHaveBeenCalled();
      expect(result).toHaveProperty('contractAddress');
      expect(result).toHaveProperty('transactionHash');
    });

    it('should handle missing wallet connection', async () => {
      getWalletPublicKey.mockResolvedValue(null);

      await expect(deployContract(mockWalletId)).rejects.toThrow(
        'Please connect your Freighter wallet first'
      );
    });

    it('should handle wallet errors', async () => {
      getWalletPublicKey.mockRejectedValue(new Error('Wallet error'));
      await expect(deployContract(mockWalletId)).rejects.toThrow('Wallet error');
    });
  });

  describe('checkAndDeployContract', () => {
    it('should deploy contract if not already deployed', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      getWalletPublicKey.mockResolvedValue(mockWalletId);
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: 'success' });

      await checkAndDeployContract(mockWalletId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/api/check-user?wallet_id=${mockWalletId}`);
      expect(getWalletPublicKey).toHaveBeenCalled();
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/update-user-contract', {
        wallet_id: mockWalletId,
        contract_address: expect.any(String),
      });
    });

    it('should skip deployment if contract already exists', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: { is_contract_deployed: true },
      });
      await checkAndDeployContract(mockWalletId);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/api/check-user?wallet_id=${mockWalletId}`);
      expect(getWalletPublicKey).not.toHaveBeenCalled();
      expect(axiosInstance.post).not.toHaveBeenCalled();
    });

    it('should handle backend check errors correctly', async () => {
      const mockError = new Error('Backend error');
      vi.mocked(axiosInstance.get).mockRejectedValue(mockError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await checkAndDeployContract(mockWalletId);

      expect(consoleSpy).toHaveBeenCalledWith('Error checking contract status:', mockError);
      consoleSpy.mockRestore();
    });

    it('should handle contract update error correctly after deployment', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: { is_contract_deployed: false },
      });
      getWalletPublicKey.mockResolvedValue(mockWalletId);
      const mockUpdateError = new Error('Update failed');
      vi.mocked(axiosInstance.post).mockRejectedValue(mockUpdateError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await checkAndDeployContract(mockWalletId);

      expect(consoleSpy).toHaveBeenCalledWith('Error checking contract status:', mockUpdateError);
      consoleSpy.mockRestore();
    });
  });
});
