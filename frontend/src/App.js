import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import ResetPassword from './components/Authentication/ResetPassword';
import ResetPasswordConfirm from './components/Authentication/ResetPasswordConfirm';
import SignIn from './components/SignIn/SignIn'; // Import the new SignIn component
import NotFound from './components/NotFound/NotFound';
import './App.css'; // Import the CSS for the page-container and flexbox layout

const App = () => {
    const [data, setData] = useState([]);  // Define state here
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

    const handleLoginChange = (status) => {
        setIsLoggedIn(status);
    };

    const handleLogout = () => {
        // Remove auth token or perform any other cleanup
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole'); // Remove the user role
        setIsLoggedIn(false);
    };

    const fetchData = async () => {
        const token = localStorage.getItem('authToken'); // Get token from localStorage or sessionStorage

        if (!token) {
            console.log('User is not signed in');
            return; // Return early if the user is not signed in
        }

        try {
            // Include token in the Authorization header
            const response = await axios.get('http://127.0.0.1:8000/api/data/', {
                headers: {
                    Authorization: `Bearer ${token}` // Assuming you're using a Bearer token
                }
            });
            console.log(response.data);
            setData(response.data); // Handle your response data
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Router>
            <div className="page-container"> {/* Flexbox container */}
                <Routes>
                    {/* Render Navbar on all routes except SignIn */}
                    <Route
                        path="/*"
                        element={
                            <>
                                <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                                <main className="content"> {/* Main content */}
                                    <Routes>
                                        {/* Normal homepage route */}
                                        <Route path="/" element={<></>} />

                                        {/* Other routes */}
                                        <Route path="/reset-password" element={<ResetPassword />} />
                                        <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirm />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </main>
                            </>
                        }
                    />

                    {/* Separate route for SignIn that does not include Navbar */}
                    <Route
                        path="/SignInRegister"
                        element={isLoggedIn ? <Navigate to="/" /> : <SignIn onLoginChange={handleLoginChange} />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
