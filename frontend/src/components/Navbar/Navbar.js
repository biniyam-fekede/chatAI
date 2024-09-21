import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import './Navbar.css';
import Logo from '../..//images/Logo.png';


function Navbar({ isLoggedIn, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
    const [showSignedOutMessage, setShowSignedOutMessage] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setShowSignedOutMessage(true);
        setTimeout(() => {
            onLogout();
            setShowSignedOutMessage(false);
        }, 1500);
    };

    const confirmSignOut = () => {
        setShowConfirmationPrompt(true);
    };

    const handleCancel = () => {
        setShowConfirmationPrompt(false);
    };

    const handleConfirmSignOut = () => {
        setShowConfirmationPrompt(false);
        handleLogout();
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-3" to="/" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        <img src={Logo} alt="Nolawi Tutorial Service Logo" className="navbar-logo" />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleNavbar}
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded={isOpen ? 'true' : 'false'}
                        aria-label="Toggle navigation"
                        style={{ background: 'none', border: 'none', padding: '0' }} // Ensure no background or border
                    >
                        {/* Custom menu icon */}
                        <div className={`menu-icon ${isOpen ? 'open' : ''}`}>
                            <div className="bar1"></div>
                            <div className="bar2"></div>
                            <div className="bar3"></div>
                        </div>
                    </button>

                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link className="nav-link active me-3 nav-item-custom" aria-current="page" to="/" onClick={toggleNavbar}>Home</Link>
                            {isLoggedIn && (
                                <Link className="nav-link active me-3 nav-item-custom" to="/dashboard" onClick={toggleNavbar}>Dashboard</Link>
                            )}
                            <Link className="nav-link active me-3 nav-item-custom" to="/PricingSection" onClick={toggleNavbar}>Pricing</Link>
                            <Link className="nav-link me-3 nav-item-custom" to="/FindTutor" onClick={toggleNavbar}>Find a Tutor</Link>
                            <Link className="nav-link me-3 nav-item-custom" to="/BecomeTutor" onClick={toggleNavbar}>Become a Tutor</Link>
                            {isLoggedIn ? (
                                <span className="nav-link me-3 nav-item-custom" onClick={confirmSignOut}>Sign Out</span>
                            ) : (
                                <Link className="nav-link me-3 nav-item-custom" to="/SignInRegister" onClick={toggleNavbar}>Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showConfirmationPrompt && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <h2 className="confirmation-title">Are you sure you want to sign out?</h2>
                        <button onClick={handleConfirmSignOut} className="confirmation-button">Yes</button>
                        <button onClick={handleCancel} className="confirmation-button">No</button>
                    </div>
                </div>
            )}

            {showSignedOutMessage && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <div className="checkmark-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                            </svg>
                        </div>
                        <h2 className="confirmation-title">Signed Out!</h2>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;