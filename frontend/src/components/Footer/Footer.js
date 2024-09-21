import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container text-center">
                <p>&copy; 2024 All rights reserved.</p>
                <p>
                    <a href="/" className="footer-link">Terms of Service</a> | <a href="/" className="footer-link">Privacy Policy</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;