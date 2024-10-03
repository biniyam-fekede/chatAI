import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Bot.css'; // Styling for the bot
import axios from 'axios'; // Import axios for API calls

const Bot = ({ isSidebarOpen }) => {
  const [messages, setMessages] = useState([]); // Manage messages state internally
  const [inputValue, setInputValue] = useState(''); // Manage inputValue state internally
  const [isTyping, setIsTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(''); // Store conversation title
  const [conversationId, setConversationId] = useState(null); // Store conversation ID
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation(); // Access the current location
  const navigate = useNavigate(); // Initialize navigate

  // Function to make API request to the Django backend
  const fetchBotResponse = async (userMessage) => {
    try {
      const response = await axios.post('http://localhost:8000/api/get-data/', { message: userMessage });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  // Save the entire conversation to the backend
  const saveConversationToBackend = async (title, conversation) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/save-conversation/',
        {
          conversation_id: conversationId, // Include if updating an existing conversation
          title: title || 'Untitled Conversation',
          conversation, // Send the entire conversation (array of messages)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log('Conversation saved successfully');
        // Update conversation ID for new conversations
        if (response.data.conversation_id) {
          setConversationId(response.data.conversation_id);
        }
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Helper function to generate a title from the first message
  const generateTitleFromMessage = (message) => {
    const maxLength = 20; // Set a maximum length for the title
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...' // Truncate and add ellipsis
      : message;
  };

  // Send Message Handler
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue;
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: userMessage, time: new Date().toLocaleTimeString() },
    ]);

    // Set the conversation title based on the first message if not set
    if (!conversationTitle) {
      const title = generateTitleFromMessage(userMessage); // Generate title from first message
      setConversationTitle(title);
    }

    setInputValue(''); // Clear the input field
    setIsTyping(true);

    // Fetch the response from the backend
    const botResponse = await fetchBotResponse(userMessage);

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'bot', text: botResponse, time: new Date().toLocaleTimeString() },
    ]);

    setIsTyping(false);
    scrollToBottom();
  };

  useEffect(() => {
    const fetchSavedConversation = async () => {
      if (location.state && location.state.isNewConversation) {
        // New conversation initiated
        setMessages([]);
        setConversationTitle('');
        setConversationId(null);
  
        // Clear the state to prevent re-triggering
        navigate(location.pathname, { replace: true });
      } else {
        // Existing conversation or first load
        const params = new URLSearchParams(location.search);
        const selectedConversationId = params.get('conversationId');
  
        if (selectedConversationId) {
          // Load existing conversation
          try {
            const token = localStorage.getItem('authToken');
            if (!token) {
              console.error('No auth token found');
              return;
            }
  
            const response = await axios.get(
              `http://localhost:8000/api/conversations/${selectedConversationId}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setMessages(response.data.conversation);
            setConversationTitle(response.data.title);
            setConversationId(response.data.id);
          } catch (error) {
            console.error('Error fetching conversation:', error);
          }
        } else {
          // No conversationId in URL, start a new conversation
          setMessages([]);
          setConversationTitle('');
          setConversationId(null);
        }
      }
    };
  
    fetchSavedConversation();
  }, [location]); // Re-run when the location changes
  
  // Function to save conversation after bot responds
  useEffect(() => {
    if (!isTyping && messages.length > 0) {
      saveConversationToBackend(conversationTitle, messages);
    }
  }, [isTyping, messages, conversationTitle]);

  // Handle Enter Key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Adjust Textarea Height Dynamically
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  // Scroll to the Latest Message
  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  // Format Message Text (Bold/Italic)
  const formatMessageText = (text) => {
    if (!text) {
      return { __html: '' }; // Return empty if text is undefined or null
    }

    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text with **text**
      .replace(/\*(.*?)\*/g, '<i>$1</i>'); // Italic text with *text*

    return { __html: formattedText };
  };

  // Delete Message
  const handleDeleteMessage = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  // Edit Message
  const handleEditMessage = (index) => {
    const messageToEdit = messages[index];
    if (messageToEdit.type === 'user') {
      setInputValue(messageToEdit.text);
      handleDeleteMessage(index); // Remove the message while editing
    }
  };

  // Use effect to scroll to the bottom whenever messages update
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages update
  }, [messages]);

  return (
    <div className={`chat-section ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="chat-header">
        <h1>{ /*conversationTitle || */ 'Doctor Assistant AI'}</h1>
      </div>

      {/* The chat window is the only part that will scroll */}
      <div className="chat-window" ref={chatWindowRef}>
        {Array.isArray(messages) &&
          messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}>
              <span dangerouslySetInnerHTML={formatMessageText(msg.text)}></span>
              <div className="message-actions">
                {msg.type === 'user' && (
                  <>
                    <button onClick={() => handleEditMessage(index)}>Edit</button>
                    <button onClick={() => handleDeleteMessage(index)}>Delete</button>
                  </>
                )}
                <span className="timestamp">{msg.time}</span>
              </div>
            </div>
          ))}
        {isTyping && (
          <div className="message-bubble bot-message typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>

      <div className="input-section">
        <textarea
          ref={inputRef}
          className="input-box"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onInput={adjustTextareaHeight}
          onKeyDown={handleKeyPress}
          placeholder="Ask any medical question..."
        ></textarea>
        <button className="send-button" onClick={handleSendMessage}>
          {/* Update the SVG to a valid one or use an icon library */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="white"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Bot;
