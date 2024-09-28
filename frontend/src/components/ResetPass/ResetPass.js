import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ResetPassword from '../Authentication/ResetPassword'
import './ResetPass.css';
const ResetPass= () => {
    return (
        <div className="Reset-password">
            <Header />
            <div className="Reset-password-container">
                <ResetPassword/> 
            </div>
            <Footer />
        </div>
    );
};

export default ResetPass;
