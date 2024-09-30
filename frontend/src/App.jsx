import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import LendingForm from './components/LendingForm';
import { connectWallet, logout } from './utils/wallet';

function App() {
  const [walletId, setWalletId] = useState(localStorage.getItem('wallet_id'));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (walletId) {
      localStorage.setItem('wallet_id', walletId);
    } else {
      localStorage.removeItem('wallet_id');
    }
  }, [walletId]);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      const address = await connectWallet();
      if (address) {
        setWalletId(address);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setWalletId(null);
  };

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header walletId={walletId} onConnectWallet={handleConnectWallet} onLogout={handleLogout} />
        <main className="container my-5" style={{ flex: 1 }}>
          {error && <div className="alert alert-danger">{error}</div>}
          <Routes>
            <Route path="/" element={
              walletId ? (
                <>
                  <Home />
                  <LendingForm walletId={walletId} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route
              path="/login"
              element={walletId ? <Navigate to="/" /> : <Login onConnectWallet={handleConnectWallet} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
