/**
 * js/movies.js
 * Handles fetching, rendering, and filtering of movies on the movies.html page.
 */

let allMovies = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Navbar
    renderNavbar('navbar-container');

    // DOM Elements
    const moviesGrid = document.getElementById('movies-grid');
    const searchInput = document.getElementById('search-input');
    const genreFilter = document.getElementById('genre-filter');
    const languageFilter = document.getElementById('language-filter');

    // Load data from centralized accessor
    allMovies = await getMovies();

    // Populate filter dropdowns dynamically based on data
    populateFilters(allMovies, genreFilter, languageFilter);

    // Initial render
    renderMovies(allMovies, moviesGrid);

    // Event Listeners for Filters
    searchInput.addEventListener('input', () => applyFilters(moviesGrid, searchInput, genreFilter, languageFilter));
    genreFilter.addEventListener('change', () => applyFilters(moviesGrid, searchInput, genreFilter, languageFilter));
    languageFilter.addEventListener('change', () => applyFilters(moviesGrid, searchInput, genreFilter, languageFilter));
});

/**
 * Extracts unique genres and languages and populates the select dropdowns.
 */
function populateFilters(movies, genreSelect, languageSelect) {
    const genres = new Set();
    const languages = new Set();

    movies.forEach(movie => {
        if (movie.genre) genres.add(movie.genre);
        if (movie.language) languages.add(movie.language);
    });

    // Add options to Genre select
    Array.from(genres).sort().forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });

    // Add options to Language select
    Array.from(languages).sort().forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        languageSelect.appendChild(option);
    });
}

/**
 * Applies search and filter criteria to the movies array and re-renders.
 */
function applyFilters(grid, searchInput, genreSelect, languageSelect) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreSelect.value;
    const selectedLanguage = languageSelect.value;

    const filteredMovies = allMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === '' || movie.genre === selectedGenre;
        const matchesLanguage = selectedLanguage === '' || movie.language === selectedLanguage;
        
        return matchesSearch && matchesGenre && matchesLanguage;
    });

    renderMovies(filteredMovies, grid);
}

/**
 * Renders the array of movies to the grid container.
 */
function renderMovies(movies, grid) {
    if (movies.length === 0) {
        grid.innerHTML = `<div class="no-results">
            <h3>No movies found</h3>
            <p>Try adjusting your search or filters.</p>
        </div>`;
        return;
    }

    let html = '';
    movies.forEach(movie => {
        html += `
            <a href="movie-details.html?id=${movie.id}" class="movie-card-link">
                <div class="card">
                    <img src="${movie.posterUrl}" alt="${movie.title}" class="card-img" onerror="this.src='https://via.placeholder.com/300x450?text=Poster'">
                    <div class="card-body">
                        <h3 class="card-title">${movie.title}</h3>
                        <p class="card-text">${movie.genre} &bull; ${movie.language}</p>
                        <p class="card-text" style="margin-top: 0.25rem; color: var(--accent-color);">⭐ ${movie.rating}</p>
                    </div>
                </div>
            </a>
        `;
    });

    grid.innerHTML = html;
}
