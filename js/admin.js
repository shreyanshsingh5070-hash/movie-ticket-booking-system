/**
 * js/admin.js
 * Handles CRUD operations for movies, shows, and viewing bookings in the admin dashboard.
 */

let localMovies = [];
let localShows = [];
let allBookings = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Require Auth and verify role
    if (!requireAuth()) return;

    renderNavbar('navbar-container');

    // 2. Initialize Data
    await initializeData();

    // 3. Render Tables
    renderMoviesTable();
    renderShowsTable();
    renderBookingsTable();

    // 4. Setup Tab Navigation
    setupTabs();
});

/**
 * Ensures data is available in localStorage, fetching from JSON if needed via app.js helper
 */
async function initializeData() {
    localMovies = await getMovies();
    localShows = await getShows();
    allBookings = await getBookings();
}

/**
 * Handles tab switching in the sidebar.
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// ==========================================
// Movies Management
// ==========================================
function renderMoviesTable() {
    const tbody = document.getElementById('movies-tbody');
    
    if (localMovies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No movies found</td></tr>';
        return;
    }

    tbody.innerHTML = localMovies.map(movie => `
        <tr>
            <td>${movie.id}</td>
            <td><strong>${movie.title}</strong></td>
            <td>${movie.genre}</td>
            <td>${movie.duration}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-secondary btn-sm" onclick="editMovie(${movie.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMovie(${movie.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openMovieModal() {
    document.getElementById('movie-form').reset();
    document.getElementById('movie-id').value = '';
    document.getElementById('movie-modal-title').textContent = 'Add Movie';
    document.getElementById('movie-modal').classList.add('active');
}

function editMovie(id) {
    const movie = localMovies.find(m => m.id === id);
    if (!movie) return;

    document.getElementById('movie-id').value = movie.id;
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-genre').value = movie.genre;
    document.getElementById('movie-language').value = movie.language;
    document.getElementById('movie-duration').value = movie.duration;
    document.getElementById('movie-rating').value = movie.rating;
    document.getElementById('movie-poster').value = movie.posterUrl;
    document.getElementById('movie-desc').value = movie.description;
    document.getElementById('movie-cast').value = movie.cast.join(', ');

    document.getElementById('movie-modal-title').textContent = 'Edit Movie';
    document.getElementById('movie-modal').classList.add('active');
}

function saveMovie() {
    const form = document.getElementById('movie-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const idStr = document.getElementById('movie-id').value;
    const isEditing = idStr !== '';
    
    const newMovie = {
        id: isEditing ? parseInt(idStr) : Date.now(),
        title: document.getElementById('movie-title').value,
        genre: document.getElementById('movie-genre').value,
        language: document.getElementById('movie-language').value,
        duration: document.getElementById('movie-duration').value,
        rating: document.getElementById('movie-rating').value,
        posterUrl: document.getElementById('movie-poster').value,
        description: document.getElementById('movie-desc').value,
        cast: document.getElementById('movie-cast').value.split(',').map(s => s.trim())
    };

    if (isEditing) {
        const index = localMovies.findIndex(m => m.id === parseInt(idStr));
        localMovies[index] = newMovie;
        showToast('Movie updated successfully');
    } else {
        localMovies.push(newMovie);
        showToast('Movie added successfully');
    }

    saveToLocalStorage('mtbs_movies', localMovies);
    renderMoviesTable();
    closeModal('movie-modal');
}

function deleteMovie(id) {
    if (confirm('Are you sure you want to delete this movie? This may affect linked shows.')) {
        localMovies = localMovies.filter(m => m.id !== id);
        saveToLocalStorage('mtbs_movies', localMovies);
        showToast('Movie deleted');
        renderMoviesTable();
    }
}

// ==========================================
// Shows Management
// ==========================================
function renderShowsTable() {
    const tbody = document.getElementById('shows-tbody');
    
    if (localShows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No shows found</td></tr>';
        return;
    }

    tbody.innerHTML = localShows.map(show => {
        const movie = localMovies.find(m => m.id === show.movieId);
        const movieTitle = movie ? movie.title : 'Unknown Movie';
        
        return `
            <tr>
                <td>${show.id}</td>
                <td><strong>${movieTitle}</strong></td>
                <td>${show.theatre}</td>
                <td>${show.date} <br> <span style="color:var(--text-secondary); font-size:12px;">${show.time}</span></td>
                <td>$${show.price.toFixed(2)}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-secondary btn-sm" onclick="editShow(${show.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteShow(${show.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openShowModal() {
    document.getElementById('show-form').reset();
    document.getElementById('show-id').value = '';
    document.getElementById('show-modal-title').textContent = 'Add Show';
    
    populateMovieSelect();
    
    document.getElementById('show-modal').classList.add('active');
}

function populateMovieSelect(selectedId = null) {
    const select = document.getElementById('show-movie');
    select.innerHTML = '<option value="">Select a movie...</option>' + 
        localMovies.map(m => `<option value="${m.id}" ${selectedId === m.id ? 'selected' : ''}>${m.title}</option>`).join('');
}

function editShow(id) {
    const show = localShows.find(s => s.id === id);
    if (!show) return;

    populateMovieSelect(show.movieId);

    document.getElementById('show-id').value = show.id;
    document.getElementById('show-theatre').value = show.theatre;
    document.getElementById('show-date').value = show.date;
    document.getElementById('show-time').value = show.time;
    document.getElementById('show-screen').value = show.screenType;
    document.getElementById('show-price').value = show.price;

    document.getElementById('show-modal-title').textContent = 'Edit Show';
    document.getElementById('show-modal').classList.add('active');
}

function saveShow() {
    const form = document.getElementById('show-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const idStr = document.getElementById('show-id').value;
    const isEditing = idStr !== '';
    const movieId = parseInt(document.getElementById('show-movie').value);
    
    if (!movieId) {
        showToast('Please select a movie', 'error');
        return;
    }
    
    const newShow = {
        id: isEditing ? parseInt(idStr) : Date.now(),
        movieId: movieId,
        theatre: document.getElementById('show-theatre').value,
        date: document.getElementById('show-date').value,
        time: document.getElementById('show-time').value,
        screenType: document.getElementById('show-screen').value,
        price: parseFloat(document.getElementById('show-price').value),
        totalSeats: 100, 
        bookedSeats: [] 
    };

    if (isEditing) {
        const index = localShows.findIndex(s => s.id === parseInt(idStr));
        newShow.bookedSeats = localShows[index].bookedSeats;
        localShows[index] = newShow;
        showToast('Show updated successfully');
    } else {
        localShows.push(newShow);
        showToast('Show added successfully');
    }

    saveToLocalStorage('mtbs_shows', localShows);
    renderShowsTable();
    closeModal('show-modal');
}

function deleteShow(id) {
    if (confirm('Are you sure you want to delete this showtime?')) {
        localShows = localShows.filter(s => s.id !== id);
        saveToLocalStorage('mtbs_shows', localShows);
        showToast('Show deleted');
        renderShowsTable();
    }
}

// ==========================================
// Bookings Overview
// ==========================================
function renderBookingsTable() {
    const tbody = document.getElementById('bookings-tbody');
    
    if (allBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No bookings found</td></tr>';
        return;
    }

    const sortedBookings = [...allBookings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    tbody.innerHTML = sortedBookings.map(booking => `
        <tr>
            <td style="font-family:monospace; font-size:12px;">${booking.bookingId}</td>
            <td>${booking.userId}</td>
            <td><strong>${booking.movieTitle}</strong></td>
            <td>${booking.date} ${booking.time}</td>
            <td>${booking.seats.length} (${booking.seats.join(',')})</td>
            <td>$${booking.totalPrice.toFixed(2)}</td>
        </tr>
    `).join('');
}

// ==========================================
// Utils
// ==========================================
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}
