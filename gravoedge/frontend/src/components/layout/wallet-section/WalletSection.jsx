import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/custom-button/Button';
import { useWalletStore } from '@/stores/useWalletStore';
import { STELLAR_NETWORK } from '@/utils/constants';
import { getTokenBalances } from '@/services/wallet';
import FreighterIcon from '@/assets/icons/freighter-icon.svg?react';

const FRIENDLY_NETWORK_NAME = {
  TESTNET: 'Testnet',
  PUBLIC: 'Mainnet',
  FUTURENET: 'Futurenet',
};

/**
 * Formats a Stellar public key (G...) for display.
 * Shows first 5 and last 4 characters.
 */
const formatStellarKey = (key) => {
  if (!key || key.length < 9) return key || '';
  return `${key.slice(0, 5)}...${key.slice(-4)}`;
};

/**
 * WalletSection component for Stellar/Freighter wallet integration.
 *
 * Shows:
 * - Connect Wallet button (when not connected, desktop)
 * - Connected wallet info: Freighter icon, truncated public key, network badge
 * - Dropdown menu: XLM balance, full public key, disconnect option (mobile + desktop)
 */
const WalletSection = ({ onConnectWallet, onLogout }) => {
  const { walletId } = useWalletStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [xlmBalance, setXlmBalance] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  const menuRef = useRef(null);

  const networkLabel = FRIENDLY_NETWORK_NAME[STELLAR_NETWORK] || 'Testnet';
  const isTestnet = STELLAR_NETWORK !== 'PUBLIC';

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Fetch balances when wallet is connected and menu opens
  useEffect(() => {
    if (walletId && isMenuOpen) {
      getTokenBalances(walletId).then((balances) => {
        setXlmBalance(balances.XLM);
        setUsdcBalance(balances.USDC);
      }).catch(() => {
        setXlmBalance('0.0000');
        setUsdcBalance('0.0000');
      });
    }
  }, [walletId, isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('.menu-dots')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <div className="relative">
      {/* Wallet Connected / Mobile Placeholder */}
      {(isMobile || walletId) && (
        <div
          ref={menuRef}
          className={`relative ${
            isMobile
              ? 'flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#201338] lg:h-[40px] lg:w-[40px]'
              : walletId
                ? 'h-[45px] w-auto min-w-[180px] p-[1px]'
                : ''
          }`}
        >
          {!isMobile && walletId && (
            <>
              {/* Gradient border */}
              <div className="from-brand to-pink absolute inset-0 rounded-[900px] bg-gradient-to-r" />
              <div className="bg-bg absolute inset-[1px] rounded-[900px]" />

              <div
                className="relative flex h-full w-full cursor-pointer items-center justify-between gap-2 rounded-[900px] px-3"
                onClick={toggleMenu}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
              >
                {/* Freighter icon */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <FreighterIcon className="h-6 w-6" />
                </div>

                {/* Truncated public key */}
                <span className="text-second-primary font-text text-sm font-semibold">
                  {formatStellarKey(walletId)}
                </span>

                {/* Network badge */}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase leading-tight ${
                    isTestnet
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {networkLabel}
                </span>
              </div>
            </>
          )}

          {/* Mobile: Menu dots that open the dropdown */}
          {isMobile && (
            <span
              className="text-primary menu-dots relative inline-block cursor-pointer p-2 text-2xl"
              onClick={toggleMenu}
            >
              &#x22EE;
            </span>
          )}

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="bg-header-button-bg absolute right-0 top-[52px] z-50 flex w-[300px] flex-col items-center rounded-[12px] border border-[#201338] p-4 shadow-lg transition-all duration-200 md:w-[320px]">
              {/* Wallet header in dropdown */}
              {walletId && (
                <div className="mb-4 flex w-full flex-col items-center gap-3">
                  {/* Freighter icon + key row */}
                  <div className="flex items-center gap-3">
                    <FreighterIcon className="h-8 w-8" />
                    <div className="flex flex-col">
                      <span className="text-second-primary font-text text-sm font-semibold">
                        {walletId}
                      </span>
                      <span
                        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isTestnet
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        Stellar {networkLabel}
                      </span>
                    </div>
                  </div>

                  {/* Balances row */}
                  <div className="flex w-full gap-3">
                    <div className="flex flex-1 flex-col items-center rounded-lg bg-[#1a1c24] p-3">
                      <span className="text-[11px] uppercase text-gray-400">XLM</span>
                      <span className="font-text text-sm font-semibold text-white">
                        {xlmBalance !== null ? xlmBalance : '—'}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col items-center rounded-lg bg-[#1a1c24] p-3">
                      <span className="text-[11px] uppercase text-gray-400">USDC</span>
                      <span className="font-text text-sm font-semibold text-white">
                        {usdcBalance !== null ? usdcBalance : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile connect button (shown when not connected on mobile) */}
              {isMobile && !walletId && (
                <Button
                  className="h-[48px] w-[238px] text-sm md:h-[46px] md:w-[226px] md:text-xs"
                  onClick={onConnectWallet}
                >
                  <span>Connect Wallet</span>
                </Button>
              )}

              {/* Disconnect button */}
              {walletId && (
                <div className="relative mt-2 w-full p-[1px]">
                  <div className="from-brand to-pink absolute inset-0 rounded-[900px] bg-gradient-to-r" />
                  <div className="bg-bg absolute inset-[1px] rounded-[900px]" />
                  <button
                    className="text-primary font-text relative flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[900px] text-sm font-bold transition-opacity hover:opacity-90"
                    onClick={handleLogoutClick}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Desktop: Connect Wallet Button */}
      {!isMobile && !walletId && (
        <Button variant="primary" size="md" onClick={onConnectWallet}>
          <span className="flex items-center gap-2">
            <FreighterIcon className="h-4 w-4" />
            Connect Wallet
          </span>
        </Button>
      )}
    </div>
  );
};

export default WalletSection;
