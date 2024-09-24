import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="not-found-wrapper">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">Oops! The page you’re looking for doesn’t exist.</p>
            <Link to="/" className="not-found-home-link auth-button">Go Back Home</Link>
        </div>
    );
}

export default NotFound;