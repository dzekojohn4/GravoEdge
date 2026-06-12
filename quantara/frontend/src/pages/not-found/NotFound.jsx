import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

/**
 * NotFound page displayed for undefined routes.
 *
 * Renders a friendly 404 message with a link back to the home page
 * so users have a clear path forward instead of seeing a blank page.
 */
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="not-found-home-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
