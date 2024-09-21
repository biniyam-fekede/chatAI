import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import { validateRegisterPassword, validatePassword2 } from './validate'; // Ensure these functions are correctly implemented in 'validate.js'

function ResetPasswordConfirm() {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [password2Error, setPassword2Error] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e, type) => {
        const { value } = e.target;
        if (type === 'password') {
            setPassword(value);
            if (password2) {
                const validationError = validatePassword2(value, password2);
                setPassword2Error(validationError);
            }
            const validationError = validateRegisterPassword(value);
            setPasswordError(validationError);
        } else {
            setPassword2(value);
            const validationError = validatePassword2(password, value);
            setPassword2Error(validationError);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordValidationError = validateRegisterPassword(password);
        const password2ValidationError = validatePassword2(password, password2);

        setPasswordError(passwordValidationError);
        setPassword2Error(password2ValidationError);

        if (passwordValidationError || password2ValidationError) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/password-reset-confirm/${uidb64}/${token}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, password2 })
            });

            if (response.ok) {
                setSuccessMessage('Password reset successful!');
                setIsResetSuccessful(true);
                setTimeout(() => navigate('/SignInRegister'), 2000); // Reduces delay for user experience
            } else {
                setPasswordError('Error resetting password. Please try again.');
            }
        } catch (error) {
            setPasswordError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <div className="reset-password-field input-with-icon">
                    <label>New Password</label>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        required
                    />
                    <span className="password-toggle-icon2" onClick={togglePasswordVisibility}>
                        <i className={passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </span>
                    {passwordError && <div className="error-message">{passwordError}</div>}
                </div>
                <div className="reset-password-field input-with-icon">
                    <label>Confirm New Password</label>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={password2}
                        onChange={(e) => handleInputChange(e, 'password2')}
                        required
                    />
                    <span className="password-toggle-icon2" onClick={togglePasswordVisibility}>
                        <i className={passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </span>
                    {password2Error && <div className="error-message">{password2Error}</div>}
                </div>

                {successMessage && <div className="success-message">{successMessage}</div>}

                {!isResetSuccessful ? (
                    <button type="submit" className="reset-password-button">
                        Reset Password
                    </button>
                ) : (
                    <button disabled className="reset-password-button">
                        Redirecting to login page...
                    </button>
                )}
            </form>
        </div>
    );
}

export default ResetPasswordConfirm;
