import React, { useState, useEffect, useRef } from 'react';
import './Bot.css'; // Styling for the bot

const Bot = ({ messages, setMessages, inputValue, setInputValue, isSidebarOpen }) => {
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  // Simulate Bot Response
  const simulateBotResponse = (userMessage) => {
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'I am a medical assistant, how can I help?', time: new Date().toLocaleTimeString() },
      ]);
      setIsTyping(false);
      scrollToBottom();
    }, 1000);
  };

  // Send Message Handler
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue;
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: userMessage, time: new Date().toLocaleTimeString() },
    ]);
    setInputValue(''); // Clear the input field
    setIsTyping(true);
    simulateBotResponse(userMessage);
  };

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
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>');
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
      handleDeleteMessage(index);
    }
  };

  // Use effect to scroll to the bottom whenever messages update
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages update
  }, [messages]);

  return (
    <div className={`chat-section ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="chat-header">
        <h1>AI Doctor Assistant</h1>
      </div>

      {/* The chat window is the only part that will scroll */}
      <div className="chat-window" ref={chatWindowRef}>
        {Array.isArray(messages) && messages.map((msg, index) => (
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
          placeholder="Ask a medical question..."
        ></textarea>
        <button className="send-button" onClick={handleSendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              d="M3.293 12.707a1 1 0 010-1.414l15-15a1 1 0 011.414 1.414L6.414 12l13.293 13.293a1 1 0 01-1.414 1.414l-15-15z"
              fill="white"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Bot;
