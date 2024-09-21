import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ResetPassword from './components/Authentication/ResetPassword';
import ResetPasswordConfirm from './components/Authentication/ResetPasswordConfirm';
import SignInRegister from './components/Authentication/SignInRegister';
import './App.css'; // Import the CSS for the page-container and flexbox layout

const App = () => {
    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

                if (!token) {
                    console.error('No token found');
                    return;
                }

                // Axios request with Authorization header
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`  // Add token to Authorization header
                    }
                };

                const response = await axios.get('http://127.0.0.1:8000/api/data/', config);
                setData(response.data);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    const handleLoginChange = (status) => {
        setIsLoggedIn(status);
    };

    const handleLogout = () => {
        // Remove auth token and other cleanup
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole'); // Remove the user role
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="page-container"> {/* Flexbox container */}
                <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                
                <main className="content"> {/* Main content */}
                    <h1>Data from Backend</h1>
                    {isLoggedIn ? (
                        data.map(item => (
                            <p key={item.id}>{item.name}</p>
                        ))
                    ) : (
                        <p>Please log in to see the data.</p>
                    )}
                </main>
                <Routes>
                    <Route
                        path="/SignInRegister"
                        element={isLoggedIn ? <Navigate to="/" /> : <SignInRegister isLoggedIn={isLoggedIn} onLoginChange={handleLoginChange} />} 
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirm />} />
                </Routes>
                <Footer /> {/* Footer */}
            </div>
        </Router>
    );
};

export default App;
