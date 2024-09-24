import React, { useState } from 'react';
import './PreviousConversations.css';
import { FaCommentDots } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const PreviousConversations = ({ isSignedIn, onLogout }) => {
    const [showModal, setShowModal] = useState(false); // State for controlling the modal visibility
    const [showLoggedOutConfirmation, setShowLoggedOutConfirmation] = useState(false); // State for logged-out confirmation
    const conversations = [
        { id: 1, title: 'Ask about flu symptoms' },
        { id: 2, title: 'Discuss COVID-19 guidelines' },
        { id: 3, title: 'Follow-up consultation' },
        { id: 4, title: 'Clarify medication dosages' },
        { id: 5, title: 'Seek dietary advice' }
    ];

    const navigate = useNavigate();

    // Handle sign out
    const handleSignOut = () => {
        localStorage.removeItem('authToken'); // Remove the token from localStorage
        onLogout(); // Call onLogout to update the parent state
        setShowModal(false); // Close the modal
        setShowLoggedOutConfirmation(true); // Show the logged-out confirmation
        setTimeout(() => {
            navigate('/'); // Redirect to homepage after sign-out
            setShowLoggedOutConfirmation(false); // Hide the confirmation after 2 seconds
        }, 2000); // Show confirmation for 2 seconds
    };

    return (
        <div className="previous-conversations">
            <h3>Conversations</h3>
            <ul>
                {conversations.map((conversation) => (
                    <li key={conversation.id}>
                        <FaCommentDots className="icon" />
                        <span className="conversation-title">{conversation.title}</span>
                    </li>
                ))}

                {/* Confirmation Modal */}
                {showModal && (
                    <div className="confirmation-overlay">
                        <div className="confirmation-modal">
                            <h3 className="confirmation-title">Confirm Logout</h3>
                            <p className="confirmation-message">Are you sure you want to sign out?</p>
                            <div className="confirmation-buttons">
                                <button className="confirmation-button" onClick={handleSignOut}>
                                    Yes
                                </button>
                                <button className="confirmation-button cancel-button" onClick={() => setShowModal(false)}>
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logged Out Confirmation */}
                {showLoggedOutConfirmation && (
                    <div className="confirmation-overlay">
                        <div className="confirmation-modal">
                            <h3 className="confirmation-title">Logged Out</h3>
                            <p className="confirmation-message">You have successfully logged out.</p>
                        </div>
                    </div>
                )}
            </ul>

            <div className="sign-in-container">
                {isSignedIn ? (
                    <button className="sign-in-button" onClick={() => setShowModal(true)}>
                        Sign Out
                    </button>
                ) : (
                    <Link to="/SignInRegister" className="sign-in-button">
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PreviousConversations;
