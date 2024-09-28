// App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ResetPass from './components/ResetPass/ResetPass';
import ConfirmPass from './components/ConfirmPass/ConfirmPass';
import SignIn from './components/SignIn/SignIn'; 
import NotFound from './components/NotFound/NotFound';
import PreviousConversations from './components/PreviousConversations/PreviousConversations'; 
import Bot from './components/Bot/Bot'; // Import Bot component
import './App.css'; 

// A layout with the Navbar
const MainLayout = ({ children, isLoggedIn, onLogout, isSidebarOpen, setIsSidebarOpen, isLargeScreen }) => (
  <div className="app-container">
    <Navbar
      isLoggedIn={isLoggedIn}
      onLogout={onLogout}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isLargeScreen={isLargeScreen}
    />
    <div className="content-wrapper">
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </div>
      {/* Sidebar content */}
      <div className={`sidebar ${isSidebarOpen ? 'visible' : ''}`}>
        <PreviousConversations
          isSignedIn={isLoggedIn}
          onLogout={onLogout}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  </div>
);

// A layout for full-screen components like SignIn, ResetPassword, etc.
const FullScreenLayout = ({ children }) => (
  <div className="full-page-container">
    <main className="content">
      {children}
    </main>
  </div>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1200;
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

  const handleLoginChange = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Routes that show the main layout with Navbar */}
        <Route path="/" element={
          <MainLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isLargeScreen={isLargeScreen}
          >
            <Bot isSidebarOpen={isSidebarOpen} />
          </MainLayout>
        } />
        <Route path="/previous-conversations" element={
          <MainLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isLargeScreen={isLargeScreen}
          >
            <PreviousConversations
              isSignedIn={isLoggedIn}
              onLogout={handleLogout}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </MainLayout>
        } />

        {/* Full-screen routes for SignIn, Reset Password, etc. */}
        <Route path="/SignIn" element={
          <FullScreenLayout>
            <SignIn onLoginChange={handleLoginChange} />
          </FullScreenLayout>
        } />
        <Route path="/reset-password" element={
          <FullScreenLayout>
            <ResetPass />
          </FullScreenLayout>
        } />
        <Route path="/reset-password/:uidb64/:token" element={
          <FullScreenLayout>
            <ConfirmPass />
          </FullScreenLayout>
        } />

        {/* Handle unknown routes */}
        <Route path="*" element={
          <FullScreenLayout>
            <NotFound />
          </FullScreenLayout>
        } />

        {/* SignInRegister route */}
        <Route path="/SignInRegister" element={
          isLoggedIn ? <Navigate to="/" /> : (
            <FullScreenLayout>
              <SignIn onLoginChange={handleLoginChange} />
            </FullScreenLayout>
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
