import React from 'react';
import Header from '../Header/Header';
import './SignIn.css';
import Footer from '../Footer/Footer';
import SignInRegister from '../Authentication/SignInRegister';

const SignIn = ({ onLoginChange }) => {
    return (
        <div className="signin-page">
            <Header /> {/* Header will take 10% of the page height */}
            <div className="signin-container">
                <SignInRegister onLoginChange={onLoginChange} /> {/* SignInRegister will take 80% */}
            </div>
            <Footer /> {/* Footer will take 10% */}
        </div>
    );
};

export default SignIn;
