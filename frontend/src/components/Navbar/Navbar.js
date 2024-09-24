import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../images/Logo.png';
import PreviousConversations from '../PreviousConversations/PreviousConversations';
import Bot from '../Bot/Bot';

function Navbar({ isLoggedIn, onLogout }) {  // Use isLoggedIn from App.js and onLogout function
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 769);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const toggleSidebar = () => {
        // Only allow toggling sidebar on small screens
        if (!isLargeScreen) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1069;
            setIsLargeScreen(isLarge);

            // Automatically open sidebar on large screens and close on small screens
            if (isLarge) {
                setIsSidebarOpen(true); // Keep sidebar open for large screens
            } else {
                setIsSidebarOpen(false); // Close sidebar on small screens
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="container-fluid d-flex align-items-center">
                    <Link className="navbar-brand ms-3" to="/" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        <img src={Logo} alt="Doctor Assistant AI" className="navbar-logo" />
                    </Link>

                    {/* Menu Icon visible only on small screens */}
                    { !isLargeScreen && (
                        <div
                            className={`menu-icon ${isSidebarOpen ? 'open' : ''}`}
                            onClick={toggleSidebar}
                            aria-expanded={isSidebarOpen ? 'true' : 'false'}
                            aria-label="Toggle navigation"
                        >
                            <div className="bar1"></div>
                            <div className="bar2"></div>
                            <div className="bar3"></div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="content-wrapper">
                <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    <Bot
                        messages={messages}
                        setMessages={setMessages}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                    />
                </div>

                {/* Sidebar content */}
                <div className={`sidebar ${isSidebarOpen ? 'visible' : ''}`}>
                    <PreviousConversations 
                        isSignedIn={isLoggedIn}  // Use isLoggedIn passed from App.js
                        isSidebarOpen={isSidebarOpen}
                        isSmallScreen={!isLargeScreen}
                        onLogout={onLogout}  // Use onLogout passed from App.js
                    />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
