import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ResetPassword from './components/Authentication/ResetPassword'
import ResetPasswordConfirm from './components/Authentication/ResetPasswordConfirm'
import SignInRegister from './components/Authentication/SignInRegister'
import './App.css'; // Import the CSS for the page-container and flexbox layout

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/data/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

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

    return (
        <Router>
            <div className="page-container"> {/* Flexbox container */}
                <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                
                <main className="content"> {/* Main content */}
                    <h1>Data from Backend</h1>
                    {data.map(item => (
                        <p key={item.id}>{item.name}</p>
                    ))}
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
