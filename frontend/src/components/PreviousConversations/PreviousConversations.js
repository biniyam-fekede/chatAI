import React, { useState, useEffect } from 'react';
import './PreviousConversations.css';
import {
  FaCommentDots,
  FaEdit,
  FaPlus,
  FaSave,
  FaQuestionCircle,
  FaUserAlt,
  FaHistory,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PreviousConversations = ({ isSignedIn, onLogout, setIsSidebarOpen }) => {
  const [showModal, setShowModal] = useState(false); // For the sign-out confirmation modal
  const [showLoggedOutConfirmation, setShowLoggedOutConfirmation] = useState(false); // Logged out message
  const [conversations, setConversations] = useState([]); // For fetching conversations dynamically
  const [editingConversationId, setEditingConversationId] = useState(null); // For tracking edited conversations
  const [editedTitle, setEditedTitle] = useState(''); // Store edited title

  const navigate = useNavigate();

  // Fetch previous conversations from the backend
  const fetchPreviousConversations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }
      const response = await axios.get('http://localhost:8000/api/conversations/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPreviousConversations();
    }
  }, [isSignedIn]);

  // Load a specific conversation and navigate to the chat page
  const loadConversation = (conversationId) => {
    try {
      // Close the sidebar
      setIsSidebarOpen(false);

      // Navigate to the chat page (Bot component) with the conversationId as a query parameter
      navigate(`/?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    // Close the sidebar
    setIsSidebarOpen(false);

    // Navigate to the chat page without a conversationId to start a new conversation
    navigate('/');
  };

  // Save updated title
  const saveUpdatedTitle = async (conversationId, originalTitle) => {
    try {
      if (editedTitle !== originalTitle && editedTitle.trim() !== '') {
        const token = localStorage.getItem('authToken');
        await axios.put(
          `http://localhost:8000/api/conversations/${conversationId}/update-title/`,
          { title: editedTitle },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, title: editedTitle } : conversation
          )
        );
      }
      // Reset editing state
      setEditingConversationId(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  // Handle sign-out confirmation modal
  const handleSignOut = () => {
    setShowModal(true); // Show the modal when "Sign Out" is clicked
  };

  // Confirm sign-out
  const confirmSignOut = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    onLogout(); // Call onLogout to update the parent state
    setShowModal(false); // Close the modal
    setShowLoggedOutConfirmation(true); // Show the logged-out confirmation

    setTimeout(() => {
      navigate('/SignInRegister'); // Redirect to sign-in page after logging out
      setShowLoggedOutConfirmation(false); // Hide the confirmation after 2 seconds
    }, 2000);
  };

  // Cancel sign-out
  const cancelSignOut = () => {
    setShowModal(false); // Close the modal without signing out
  };

  return (
    <div className="previous-conversations">
      {isSignedIn && <h3>Previous Conversations</h3>}

      {isSignedIn ? (
        <>
          <button className="new-conversation-button" onClick={startNewConversation}>
            <FaPlus className="new-conversation-icon" /> New Conversation
          </button>
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <FaCommentDots className="icon" onClick={() => loadConversation(conversation.id)} />
                {editingConversationId === conversation.id ? (
                  <>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => saveUpdatedTitle(conversation.id, conversation.title)} // Save on blur
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveUpdatedTitle(conversation.id, conversation.title); // Save on Enter key press
                        if (e.key === 'Escape') {
                          setEditingConversationId(null);
                          setEditedTitle('');
                        } // Cancel on Escape key
                      }}
                      autoFocus
                    />
                  </>
                ) : (
                  <>
                    <span className="conversation-title" onClick={() => loadConversation(conversation.id)}>
                      {conversation.title}
                    </span>
                    <FaEdit
                      className="edit-icon"
                      onClick={() => {
                        setEditingConversationId(conversation.id);
                        setEditedTitle(conversation.title); // Initialize the input with the current title
                      }}
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="additional-info">
          <h2>Welcome to AI Doctor's Assistant!</h2>
          <p>Here you can:</p>
          <ul className="features-list">
            <li>
              <FaSave className="feature-icon" /> Save your past conversations for future reference
            </li>
            <li>
              <FaQuestionCircle className="feature-icon" /> Get personalized responses to your questions
            </li>
            <li>
              <FaUserAlt className="feature-icon" /> Access our expert advice anytime, anywhere
            </li>
            <li>
              <FaHistory className="feature-icon" /> Keep track of your consultations and advice history
            </li>
          </ul>
          <div className="sign-in-message">Sign in to save or view your previous conversations.</div>
        </div>
      )}

      <div className="sign-in-container">
        {isSignedIn ? (
          <button className="sign-in-button" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <Link to="/SignIn" className="sign-in-button">
            Sign In
          </Link>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3 className="confirmation-title">Confirm Logout</h3>
            <p className="confirmation-message">Are you sure you want to sign out?</p>
            <div className="confirmation-buttons">
              <button className="confirmation-button" onClick={confirmSignOut}>
                Yes
              </button>
              <button className="confirmation-button cancel-button" onClick={cancelSignOut}>
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
    </div>
  );
};

export default PreviousConversations;
