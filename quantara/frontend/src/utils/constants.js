/**
 * GravoEdge Stellar Network Constants
 *
 * Contains Stellar asset addresses, network configuration, and
 * Soroban contract parameters for the GravoEdge protocol.
 *
 * Replaces the former Starknet-specific address constants.
 */

// Stellar Network Configuration
export const STELLAR_NETWORK = process.env.VITE_STELLAR_NETWORK || 'TESTNET';
export const STELLAR_HORIZON_URL =
  process.env.VITE_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
export const STELLAR_SOROBAN_RPC_URL =
  process.env.VITE_STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

// Stellar Asset Definitions
export const XLM_ASSET = {
  code: 'XLM',
  issuer: 'native', // Native Stellar asset
  decimals: 7,
};

export const USDC_ASSET = {
  code: 'USDC',
  issuer: process.env.VITE_USDC_ISSUER || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NOJ4VBH6THS2G2V', // Testnet USDC issuer
  decimals: 7,
};

// GravoEdge Soroban Contract Configuration
export const CONTRACT_ADDRESS =
  process.env.VITE_GRAVOEDGE_CONTRACT_ID ||
  'CCJZ5LW4CJ3J3Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5'; // Placeholder

export const SOROBAN_WASM_HASH =
  process.env.VITE_GRAVOEDGE_WASM_HASH || '';

// Time constants
export const ONE_HOUR_IN_MILLISECONDS = 3600000;

// Telegram bot link
export const TELEGRAM_BOT_LINK = 'https://t.me/gravoedge_bot';

/**
 * Get contract deployment data for a Soroban contract.
 *
 * @param {string} walletId - The Stellar public key
 * @returns {object} Contract deployment parameters
 */
export function getDeployContractData(walletId) {
  return {
    wasmHash: SOROBAN_WASM_HASH,
    salt: `0x${Math.floor(Math.random() * 1e16).toString(16)}`, // Generate random salt
    constructorCalldata: [walletId],
  };
}

// Dashboard tab configuration
export const DASHBOARD_TABS = {
  COLLATERAL: 'collateral',
  BORROW: 'borrow',
  DEPOSITED: 'deposited',
};

// Stellar-supported tokens for the GravoEdge protocol
export const SUPPORTED_TOKENS = [
  {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    asset: XLM_ASSET,
    icon: null, // To be populated with icon component
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    asset: USDC_ASSET,
    icon: null,
  },
];
