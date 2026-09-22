/**
 * js/movieDetails.js
 * Handles fetching specific movie data and showtimes, based on URL parameters.
 */

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar('navbar-container');

    const mainContent = document.getElementById('main-content');
    
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id'));

    if (!movieId) {
        mainContent.innerHTML = `
            <div class="not-found">
                <h2>Movie Not Found</h2>
                <p>Please select a valid movie.</p>
                <a href="movies.html" class="btn btn-primary mt-4">Browse Movies</a>
            </div>
        `;
        return;
    }

    // Load Data using centralized accessors
    const [movies, shows] = await Promise.all([
        getMovies(),
        getShows()
    ]);

    const movie = (movies || []).find(m => m.id === movieId);
    
    if (!movie) {
        mainContent.innerHTML = `
            <div class="not-found">
                <h2>Movie Not Found</h2>
                <p>The requested movie does not exist.</p>
                <a href="movies.html" class="btn btn-primary mt-4">Browse Movies</a>
            </div>
        `;
        return;
    }

    const movieShows = (shows || []).filter(s => s.movieId === movieId);
    renderMovieDetails(movie, movieShows, mainContent);
});

/**
 * Renders the movie details and grouped showtimes.
 */
function renderMovieDetails(movie, shows, container) {
    // Generate Cast HTML
    const castHTML = movie.cast.map(actor => `<span class="cast-pill">${actor}</span>`).join('');

    // Group shows by date
    const groupedShows = {};
    shows.forEach(show => {
        if (!groupedShows[show.date]) {
            groupedShows[show.date] = [];
        }
        groupedShows[show.date].push(show);
    });

    // Sort dates
    const sortedDates = Object.keys(groupedShows).sort();

    // Generate Shows HTML
    let showsHTML = '';
    if (sortedDates.length === 0) {
        showsHTML = '<p>No showtimes available for this movie.</p>';
    } else {
        sortedDates.forEach(date => {
            const dateObj = new Date(date);
            dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
            const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            
            const dayShows = groupedShows[date].sort((a, b) => a.time.localeCompare(b.time));
            
            const timeButtons = dayShows.map(show => `
                <button class="showtime-btn" onclick="selectShow(${show.id})">
                    <span class="showtime-time">${show.time}</span>
                    <span class="showtime-meta">${show.screenType} &bull; $${show.price}</span>
                </button>
            `).join('');

            showsHTML += `
                <div class="date-group">
                    <div class="date-title">${dateStr}</div>
                    <div class="times-grid">
                        ${timeButtons}
                    </div>
                </div>
            `;
        });
    }

    const html = `
        <div class="movie-details-container">
            <div>
                <img src="${movie.posterUrl}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=Poster'">
            </div>
            
            <div class="movie-info">
                <h1>${movie.title}</h1>
                <div class="movie-meta">
                    <span>🎬 ${movie.genre}</span>
                    <span>⏱ ${movie.duration}</span>
                    <span>🌍 ${movie.language}</span>
                    <span style="color: var(--accent-color);">⭐ ${movie.rating}</span>
                </div>
                
                <p class="movie-description">${movie.description}</p>
                
                <h3 style="font-size: var(--text-base); margin-bottom: var(--spacing-2);">Cast</h3>
                <div class="cast-list">
                    ${castHTML}
                </div>
            </div>
        </div>
        
        <div class="shows-section">
            <h2>Available Showtimes</h2>
            ${showsHTML}
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Handles showtime selection.
 * Stores selection in localStorage and navigates to seat selection.
 */
function selectShow(showId) {
    saveToLocalStorage('mtbs_selectedShowId', showId);
    window.location.href = `seat-selection.html?showId=${showId}`;
}
