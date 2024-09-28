import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function NotFound() {
    return (
        <div>
        <Header />
        <div className="not-found-wrapper">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">Oops! The page you’re looking for doesn’t exist.</p>
            <Link to="/" className="not-found-home-link auth-button">Go Back Home</Link>
        </div>
        <Footer />
        </div>
    );
}

export default NotFound;