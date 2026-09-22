/**
 * js/auth.js
 * Handles authentication logic (login, signup, validation).
 * Depends on app.js utility functions.
 */

/**
 * Validates email format.
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Displays inline error message for a specific field.
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Clears all inline error messages.
 */
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
}

/**
 * Signup function
 */
async function signup(username, email, password) {
    clearErrors();
    let hasError = false;

    // Basic Validation
    if (!username.trim()) {
        showError('username', 'Username is required');
        hasError = true;
    }
    
    if (!email.trim()) {
        showError('email', 'Email is required');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        hasError = true;
    }

    if (!password) {
        showError('password', 'Password is required');
        hasError = true;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        hasError = true;
    }

    if (hasError) return;

    // Check against existing users
    const users = await getUsers();
    
    const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
        showError('username', 'Username is already taken');
        return;
    }
    
    const emailExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        showError('email', 'Email is already registered');
        return;
    }

    // Create new user
    const newUser = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: 'user' // Default role
    };

    users.push(newUser);
    saveToLocalStorage('mtbs_users', users);
    
    showToast('Account created successfully! Please login.', 'success');
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

/**
 * Login function
 */
async function login(username, password) {
    clearErrors();
    let hasError = false;

    if (!username.trim()) {
        showError('username', 'Username is required');
        hasError = true;
    }
    
    if (!password) {
        showError('password', 'Password is required');
        hasError = true;
    }

    if (hasError) return;

    const users = await getUsers();
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Save current session
        const sessionUser = {
            username: user.username,
            role: user.role
        };
        saveToLocalStorage('mtbs_currentUser', sessionUser);
        
        showToast(`Welcome back, ${user.username}!`, 'success');
        
        // Redirect based on role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        showError('password', 'Invalid username or password');
    }
}

// Event Listeners for Forms
document.addEventListener('DOMContentLoaded', () => {
    // Signup Form Handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            signup(username, email, password);
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }
});
