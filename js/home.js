/* home.js - Home page (Member 1: Shreyansh) */

const movies = getMovies();
const nowList = movies.filter(m => m.status === 'now');
const soonList = movies.filter(m => m.status === 'soon');

// ---- banner: four selected cinematic movies ----
const bannerTitles = ['3 Idiots', 'Pushpa 2', 'Animal', 'Fighter'];
const featured = bannerTitles
  .map(title => movies.find(movie => movie.title.toLowerCase() === title.toLowerCase()))
  .filter(Boolean);

const slidesBox = document.getElementById('heroSlides');

if (slidesBox) {
  slidesBox.innerHTML = featured.map(function (movie, index) {
    const duration = Math.floor(movie.duration / 60) + 'h ' +
      (movie.duration % 60) + 'm';

    return (
      '<div class="carousel-item' + (index === 0 ? ' active' : '') + '">' +
        '<div class="hero-slide" style="' + heroBannerStyle(movie) + '">' +
          '<div class="hero-content">' +
            '<span class="badge bg-danger mb-2">' + escapeHTML(movie.language) + '</span>' +
            '<h1>' + escapeHTML(movie.title) + '</h1>' +
            '<p class="text-light mb-1">' + escapeHTML(movie.genre) + ' &middot; ' + duration + '</p>' +
            '<p class="small text-light opacity-75 d-none d-md-block">' + escapeHTML(movie.desc) + '</p>' +
            '<a href="movie.html?id=' + encodeURIComponent(movie.id) + '" class="btn btn-brand mt-2">Book Now</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// ---- grids ----
document.getElementById('nowShowing').innerHTML = nowList.slice(0, 8).map(movieCardHTML).join('');
document.getElementById('comingSoon').innerHTML = soonList.length
  ? soonList.map(movieCardHTML).join('')
  : '<p class="text-muted">No upcoming movies at the moment.</p>';

// ---- quick search: populate the language dropdown ----
const langs = Array.from(new Set(movies.map(m => m.language)));
const langSel = document.getElementById('qsLang');
langs.forEach(function (l) {
  langSel.innerHTML += '<option value="' + escapeHTML(l) + '">' + escapeHTML(l) + '</option>';
});

document.getElementById('quickSearch').addEventListener('submit', function (e) {
  e.preventDefault();
  const q = document.getElementById('qsText').value.trim();
  const l = langSel.value;
  // Pass the query on to the Movies page
  window.location.href = 'movies.html?q=' + encodeURIComponent(q) + '&lang=' + encodeURIComponent(l);
});
