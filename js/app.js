/**
 * js/app.js
 * Common utility functions used across the application.
 */

/**
 * Fetch and parse a JSON file with error handling.
 * @param {string} path - The path to the JSON file (e.g., './data/movies.json')
 * @returns {Promise<any>} - The parsed JSON data or null on failure
 */
async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading JSON from ${path}:`, error);
        showToast(`Failed to load data from ${path}`, 'error');
        return null;
    }
}

/**
 * Retrieve data from LocalStorage.
 * @param {string} key - The key to retrieve
 * @returns {any} - The parsed JSON data or null if not found
 */
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Save data to LocalStorage.
 * @param {string} key - The key to store data under
 * @param {any} value - The data to store (will be JSON stringified)
 */
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ==========================================
// Centralized Data Accessors (Singleton pattern for LocalStorage + JSON fallback)
// ==========================================

async function getMovies() {
    let movies = getFromLocalStorage('mtbs_movies');
    if (!movies) {
        movies = await loadJSON('data/movies.json') || [];
        saveToLocalStorage('mtbs_movies', movies);
    }
    return movies;
}

async function getShows() {
    let shows = getFromLocalStorage('mtbs_shows');
    if (!shows) {
        shows = await loadJSON('data/shows.json') || [];
        saveToLocalStorage('mtbs_shows', shows);
    }
    return shows;
}

async function getUsers() {
    let users = getFromLocalStorage('mtbs_users');
    if (!users) {
        users = await loadJSON('data/users.json') || [];
        saveToLocalStorage('mtbs_users', users);
    }
    return users;
}

async function getBookings() {
    return getFromLocalStorage('mtbs_bookings') || [];
}

// ==========================================
// Authentication Utilities
// ==========================================

/**
 * Get the currently logged-in user from LocalStorage.
 */
function getCurrentUser() {
    return getFromLocalStorage('mtbs_currentUser');
}

/**
 * Redirects to the login page if no user is currently logged in.
 */
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    // Additional check for admin dashboard
    if (window.location.pathname.includes('admin-dashboard') && user.role !== 'admin') {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('mtbs_currentUser');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Injects a responsive navbar into the specified container.
 */
function renderNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = getCurrentUser();
    
    let userLinks = '';
    if (user) {
        const adminLink = user.role === 'admin' ? `<li><a href="admin-dashboard.html" class="nav-link">Dashboard</a></li>` : '';
        userLinks = `
            ${adminLink}
            <li><span class="nav-link">Hi, ${user.username}</span></li>
            <li><a href="#" id="logout-btn" class="btn btn-secondary">Logout</a></li>
        `;
    } else {
        userLinks = `
            <li><a href="login.html" class="nav-link">Login</a></li>
            <li><a href="signup.html" class="btn btn-primary">Sign Up</a></li>
        `;
    }

    const navbarHTML = `
        <nav class="navbar">
            <div class="container">
                <a href="index.html" class="navbar-brand">
                    🍿 MovieTickets
                </a>
                <ul class="navbar-nav">
                    <li><a href="movies.html" class="nav-link">Movies</a></li>
                    ${userLinks}
                </ul>
            </div>
        </nav>
    `;

    container.innerHTML = navbarHTML;

    // Attach logout event listener if button exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// ==========================================
// UI Utilities
// ==========================================

/**
 * Displays a temporary toast notification.
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
