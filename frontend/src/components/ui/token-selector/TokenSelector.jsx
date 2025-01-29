import React from 'react';
import ETH from '@/assets/icons/ethereum.svg?react';
import USDC from '@/assets/icons/borrow_usdc.svg?react';
import STRK from '@/assets/icons/strk.svg?react';
import './tokenSelector.css';

const Tokens = [
  { id: 'ethOption', component: <ETH />, label: 'ETH' },
  { id: 'usdcOption', component: <USDC />, label: 'USDC' },
  { id: 'strkOption', component: <STRK />, label: 'STRK' },
];

const TokenSelector = ({ selectedToken, setSelectedToken, className }) => {
  const handleTokenChange = (token) => {
    setSelectedToken(token.label);
  };

  return (
    <div className={`token-selector-container ${className}`}>
      <span className="token-select-label">Select Token</span>
      <div className="token-options">
        {Tokens.map((token) => (
          <div
            className={`token-card-btn ${selectedToken === token.label ? 'selected' : ''}`}
            key={token.id}
            onClick={() => handleTokenChange(token)}
          >
            <input
              type="radio"
              id={token.id}
              checked={selectedToken === token.label}
              name="token-options"
              value={token.label}
              onChange={() => handleTokenChange(token)}
              className="token-radio"
            />
            <div className="token-name-wrapper">
              <span className="token-selector-icon">{token.component}</span>
              <label htmlFor={token.id} className="token-card-label">
                {token.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenSelector;
