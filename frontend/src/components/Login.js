import React from 'react';
import Button from './Button/Button';

function Login({ onConnectWallet }) {
  return (
    <div className="form-container">
      <h2>Connect Your Wallet</h2>
      <Button variant="secondary" size="md" className="" onClick={onConnectWallet}>
        Connect Wallet
      </Button>
    </div>
  );
}

export default Login;
