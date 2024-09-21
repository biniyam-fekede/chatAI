// validate.js

// Validate Email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required.';
    }
    return regex.test(email) ? '' : 'Invalid email format.';
};

// Validate Password for Registration
export const validateRegisterPassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!password) {
        return 'Password is required.';
    } else if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
    } else if (!hasNumber.test(password)) {
        return 'Password must contain at least one number.';
    } else if (!hasSpecialChar.test(password)) {
        return 'Password must contain at least one special character.';
    }
    return '';
};

// Validate Password for Sign In
export const validateSignInPassword = (password) => {
    if (!password) {
        return 'Password is required.';
    }
    return ''; // No specific requirements for sign in password
};

// Validate Confirm Password
export const validatePassword2 = (password, password2) => {
    if (!password2) {
        return 'Please confirm your password.';
    }
    return password !== password2 ? 'Passwords do not match.' : '';
};

// Validate Phone Number
export const validatePhoneNumber = (phoneNumber) => {
    // Updated regex to allow a leading + followed by 10 to 15 digits, with optional (), spaces, and hyphens
    const regex = /^\+?[\d\s\-()]{10,20}$/;

    if (!phoneNumber) {
        return 'Phone number is required.';
    }

    return regex.test(phoneNumber) ? '' : 'Phone number must be numeric, with an optional leading +, and may include spaces, parentheses, and hyphens.';
};


// Validate First Name
export const validateFirstName = (firstName) => {
    if (!firstName) {
        return 'First name is required.';
    }
    return '';
};

// Validate Last Name
export const validateLastName = (lastName) => {
    if (!lastName) {
        return 'Last name is required.';
    }
    return '';
};

// Validate Entire Form for Registration
export const validateRegisterForm = ({ email, password, password2, phoneNumber, firstName, lastName }) => {
    const errors = {};

    errors.email = validateEmail(email);
    errors.password = validateRegisterPassword(password);
    errors.password2 = validatePassword2(password, password2);
    errors.phoneNumber = validatePhoneNumber(phoneNumber);
    errors.firstName = validateFirstName(firstName);
    errors.lastName = validateLastName(lastName);

    return errors;
};

// Validate Entire Form for Sign In
export const validateSignInForm = ({ email, password }) => {
    const errors = {};

    errors.email = validateEmail(email);
    errors.password = validateSignInPassword(password);

    return errors;
};
