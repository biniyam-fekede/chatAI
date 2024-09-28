import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ResetPasswordConfirm from '../Authentication/ResetPassword';
import './ConfirmPass.css';

const ConfirmPass = () => {
    return (
        <div className="ConfirmPass">
            <Header />
            <div className="ConfirmPass_container">
                <ResetPasswordConfirm />
            </div>
            <Footer />
        </div>
    );
};

export default ConfirmPass;
