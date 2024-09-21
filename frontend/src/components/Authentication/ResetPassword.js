import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css';
import { validateEmail, validateRegisterPassword, validatePassword2 } from './validate'; // Import your validations

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [step, setStep] = useState(1); // Step 1: Request, Step 2: Reset
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // For handling API call delay
    const [isLinkSent, setIsLinkSent] = useState(false); // Track if the reset link has been sent
    const [isPasswordReset, setIsPasswordReset] = useState(false); // Track if the password has been reset
    const { uid, token } = useParams(); // To capture the uid and token for step 2
    const navigate = useNavigate();

    // Handle form field input changes
    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        // Start by updating the corresponding state
        switch (fieldName) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'password2':
                setPassword2(value);
                break;
            default:
                break;
        }

        // Validate input immediately for real-time feedback
        let error = '';
        switch (fieldName) {
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validateRegisterPassword(value);
                if (password2) { // Also re-validate password2 against the new password
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        password2: validatePassword2(value, password2)
                    }));
                }
                break;
            case 'password2':
                error = validatePassword2(password, value);
                break;
            default:
                break;
        }

        // Update the error state for the specific field
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: error
        }));
    };

    // Validate form fields based on the current step
    const isFormValid = () => {
        const formErrors = {
            email: step === 1 ? validateEmail(email) : '',
            password: step === 2 ? validateRegisterPassword(password) : '',
            password2: step === 2 ? validatePassword2(password, password2) : ''
        };

        setErrors(formErrors);

        return Object.values(formErrors).every((error) => error === '');
    };

    // Handle password reset request (Step 1)
    const handleRequestReset = async (e) => {
        e.preventDefault();
        if (!isFormValid() || loading) {
            return;
        }

        setLoading(true); // Set loading state
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/password-reset-request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSuccessMessage('Password reset link has been sent to your email.');
                setErrorMessage('');
                setIsLinkSent(true); // Disable the "Send Reset Link" button after successful request
            } else {
                setErrorMessage('Error in sending reset link. Please check your email address.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Handle password reset confirmation (Step 2)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!isFormValid() || loading) {  // Ensure not already processing and form is valid
            return;
        }

        const passwordError = validateRegisterPassword(password);
        const confirmPasswordError = validatePassword2(password, password2);

        if (passwordError || confirmPasswordError) {
            setErrors(prev => ({ ...prev, password: passwordError, password2: confirmPasswordError }));
            return;  // Stop the form submission if there are any password validation errors
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/password-reset-confirm/${uid}/${token}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, password2 })
            });

            if (response.ok) {
                setErrorMessage('');  // Clear any previous error messages
                setSuccessMessage('Password reset successful!');
                setIsPasswordReset(true);
                // Consider removing or decreasing delay if immediate feedback is desired
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                throw new Error('Failed to reset password');
            }
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage('Error resetting password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={step === 1 ? handleRequestReset : handleResetPassword}>
                <h2>{step === 1 ? 'Reset Password' : 'Enter New Password'}</h2>

                {step === 1 ? (
                    <>
                        <div className="reset-password-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => handleInputChange(e, 'email')}
                                required
                                disabled={loading || isLinkSent} // Disable during API call or after link is sent
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>
                    </>
                ) : (
                    <>
                       <div className="reset-password-field">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => handleInputChange(e, 'password')}
                                required
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>
                        <div className="reset-password-field">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={password2}
                                onChange={(e) => handleInputChange(e, 'password2')}
                                required
                            />
                            {errors.password2 && <div className="error-message">{errors.password2}</div>}
                        </div>

                    </>
                )}

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {step === 1 ? (
                    !isLinkSent && (
                        <button type="submit" className="reset-password-button" disabled={loading}>
                            {loading ? 'Processing...' : 'Send Reset Link'}
                        </button>
                    )
                ) : (
                    !isPasswordReset ? (
                        <button type="submit" className="reset-password-button" disabled={loading}>
                            {loading ? 'Processing...' : 'Reset Password'}
                        </button>
                    ) : (
                        <div>
                            <div className="success-message">Password Changed Successfully!</div>
                            <button disabled className="reset-password-button">
                                Redirecting to login page...
                            </button>
                        </div>
                    )
                )}

            </form>
        </div>
    );
}

export default ResetPassword;
