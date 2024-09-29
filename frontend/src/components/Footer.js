import React from 'react';

function Footer() {
  return (
    <footer className="container-fluid p-3 mt-auto" style={{ backgroundColor: '#1A202C', borderTop: '1px solid #E2E8F0' }}>
      <div className="container text-center text-white">
        <p>Follow us on:</p>
        <a href="https://twitter.com/yourprofile" className="me-3 text-white" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i> Twitter
        </a>
        <a href="https://t.me/yourprofile" className="me-3 text-white" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-telegram"></i> Telegram
        </a>
        <a href="https://discord.com/yourprofile" className="text-white" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-discord"></i> Discord
        </a>
      </div>
    </footer>
  );
}

export default Footer;