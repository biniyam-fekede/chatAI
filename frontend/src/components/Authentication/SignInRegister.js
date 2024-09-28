import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignInRegister.css';
import {
    validateEmail,
    validateRegisterPassword,
    validateSignInPassword,
    validatePassword2,
    validatePhoneNumber,
    validateFirstName,
    validateLastName,
    validateRegisterForm,
    validateSignInForm
} from './validate';

function SignInRegister({ onLoginChange, isLoggedIn }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const navigate = useNavigate();

    const validateToken = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token
            const currentTime = Date.now() / 1000;  // Current time in seconds
            
            if (payload.exp < currentTime) {  // Check if token is expired
                localStorage.removeItem('authToken');  // Token expired, remove it
                return false;  // Token is invalid
            }
            return true;  // Token is valid
        }
        return false;  // No token found
    };
    

    useEffect(() => {
        const isValid = validateToken();
        if (!isValid) {
            onLoginChange(false);  // Log the user out if the token is invalid
        } else {
            onLoginChange(true);  // Set user as logged in if the token is valid
        }
    }, [onLoginChange]);
    

    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
        setErrors({});
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        let error = '';

        switch (fieldName) {
            case 'email':
                setEmail(value);
                error = validateEmail(value);
                break;
            case 'password':
                setPassword(value);
                error = isRegistering ? validateRegisterPassword(value) : validateSignInPassword(value);
                break;
            case 'password2':
                setPassword2(value);
                if (isRegistering) {
                    error = validatePassword2(password, value);
                }
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                if (isRegistering) {
                    error = validatePhoneNumber(value);
                }
                break;
            case 'firstName':
                setFirstName(value);
                if (isRegistering) {
                    error = validateFirstName(value);
                }
                break;
            case 'lastName':
                setLastName(value);
                if (isRegistering) {
                    error = validateLastName(value);
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: error,
        }));
    };

    const isFormValid = () => {
        const formErrors = isRegistering
            ? validateRegisterForm({
                email,
                password,
                password2,
                phoneNumber,
                firstName,
                lastName,
            })
            : validateSignInForm({
                email,
                password
            });

        setErrors(formErrors);

        return Object.values(formErrors).every((error) => error === '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isFormValid()) {
            return;
        }

        const normalizedEmail = email.toLowerCase(); // Normalize the email

        const url = isRegistering 
    ? `${process.env.REACT_APP_API_BASE_URL}/api/register/` 
    : `${process.env.REACT_APP_API_BASE_URL}/api/login/`;


        const data = {
            email: normalizedEmail, // Use normalized email
            password,
            ...(isRegistering && {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                password2
            }),
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (isRegistering) {
                    if (errorData.email) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            email: 'A user with this email already exists.',
                        }));
                    } else if (errorData.password) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            password: 'Password does not meet the required criteria.',
                        }));
                    } else {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            form: 'Registration failed. Please check your inputs.',
                        }));
                    }
                } else {
                    if (errorData.detail === 'No active account found with the given credentials') {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            email: 'No account found with this email.',
                        }));
                    } else if (errorData.detail === 'The password you entered is incorrect.') {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            password: 'The password you entered is incorrect.',
                        }));
                    } else if (errorData.detail === 'Account is disabled') {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            form: 'Your account has been disabled. Please contact support.',
                        }));
                    } else {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            form: 'Sign-In failed. Please check your credentials.',
                        }));
                    }
                }
                return;
            }

            const result = await response.json();
            setErrors({});
            setConfirmationMessage(isRegistering ? 'Your account has been created successfully!' : `Welcome, ${result.first_name}!`);
            setShowConfirmation(true);

            if (!isRegistering) {
                localStorage.setItem('authToken', result.access);
                localStorage.setItem('userRole', result.role);
                setWelcomeMessage(`Welcome, ${result.first_name}!`);
                setShowWelcome(true);
                setTimeout(() => {
                    onLoginChange(true);
                    navigate('/'); 
                }, 1500);
            }
        } catch (error) {
            console.error('There was a problem with the request:', error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                form: 'An unexpected error occurred. Please try again later.',
            }));
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        if (isRegistering) {
            setIsRegistering(false);
            navigate('/SignInRegister');
        } else {
            navigate('/');
        }
    };

    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="auth-container">
            <form className="auth-form animated-form" onSubmit={handleSubmit} autoComplete="off">
                <h2 className="animated-title">{isRegistering ? 'Create an Account' : 'Sign In'}</h2>
                {isRegistering && (
                    <>
                        <div className="auth-field auth-field-inline">
                            <div className="auth-field">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => handleInputChange(e, 'firstName')}
                                    required
                                    autoComplete="off"
                                />
                                {errors.firstName && <div className="auth-error">{errors.firstName}</div>}
                            </div>
                            <div className="auth-field">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => handleInputChange(e, 'lastName')}
                                    required
                                    autoComplete="off"
                                />
                                {errors.lastName && <div className="auth-error">{errors.lastName}</div>}
                            </div>
                        </div>
                        <div className="auth-field">
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => handleInputChange(e, 'phoneNumber')}
                                required
                                autoComplete="off"
                            />
                            {errors.phoneNumber && <div className="auth-error">{errors.phoneNumber}</div>}
                        </div>
                    </>
                )}
                <div className="auth-field">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        required
                        autoComplete="off"
                    />
                    {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>
                <div className="auth-field password-field">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        required
                        autoComplete="new-password"
                    />
                    <span className="password-toggle-icon1" onClick={togglePasswordVisibility}>
                        <i className={passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </span>
                    {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>
                {isRegistering && (
                    <div className="auth-field password-field">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={password2}
                            onChange={(e) => handleInputChange(e, 'password2')}
                            required
                            autoComplete="new-password"
                        />
                        <span className="password-toggle-icon1" onClick={togglePasswordVisibility}>
                            <i className={passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                        </span>
                        {errors.password2 && <div className="auth-error">{errors.password2}</div>}
                    </div>
                )}
                {errors.form && <div className="auth-error">{errors.form}</div>}
                <div className="auth-field">
                    <button type="submit" className="auth-button animated-button">
                        {isRegistering ? 'Create an Account' : 'Sign In'}
                    </button>
                </div>
                <div className="auth-toggle">
                     <Link to="/reset-password">Forgot Password?</Link>
                </div>
                <p className="auth-toggle">
                    {isRegistering
                        ? 'Already have an account?'
                        : "Don't have an account?"}{' '}
                    <span onClick={toggleRegister}>
                        {isRegistering ? 'Sign In' : 'Create an Account'}
                    </span>
                </p>
            </form>

            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <div className="checkmark-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                            </svg>
                        </div>
                        <h2 className="confirmation-title">Success!</h2>
                        <p className="confirmation-message">{confirmationMessage}</p>
                        {isRegistering && (
                            <button onClick={handleCloseConfirmation} className="confirmation-button">Continue</button>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default SignInRegister;
