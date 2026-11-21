
# Movie-Booking-System

## Member 1 - Shreyansh

**Responsibility:** Home page, movie listing (search + filters), movie details + reviews

### Files

| File | Purpose |
|---|---|
| `index.html` + `js/home.js` | Banner slider (top 3 rated), quick search, Now Showing, Coming Soon |
| `movies.html` + `js/movies.js` | Complete movie list, search, language / genre / status filters, sorting |
| `movie.html` + `js/movie-details.js` | Movie details, trailer button, submitting and viewing reviews |

### Features

- Banner slider showing the 3 highest-rated movies
- Search by title, cast or director
- Language dropdown, genre chips, Now Showing / Coming Soon filter, sorting
- Movie details: poster, certificate, duration, cast, director, description
- Watch Trailer opens a YouTube search
- Reviews: logged-in users can submit a star rating and feedback

### Main Functions

- `applyFilters()` (movies.js)
- `movieCardHTML()` (common.js)
- `drawReviews()`, `drawReviewForm()` (movie-details.js)

---

## Member 3 - Somyani

**Responsibility:** Register, login, profile, booking history + cancellation

### Files

| File | Purpose |
|---|---|
| `register.html` + `js/auth.js` | Creating a new account |
| `login.html` + `js/auth.js` | Login, show/hide password, `?next=` redirect |
| `profile.html` + `js/profile.js` | Edit details, change password, bookings and total spent |
| `history.html` + `js/history.js` | Upcoming / Past / Cancelled bookings, view ticket, cancel |

### Features

- Registration with name, email, mobile number and password validation
- Login with safe redirect
- Profile editing and password change
- My Bookings with 3 tabs and ticket button
- Cancellation allowed up to 2 hours before the show

### Main Functions

- `currentUser()`, `requireLogin()`, `logoutUser()` (common.js)
- `getNextPage()` (auth.js)
- `canCancel()`, `draw()` (history.js)

---

## Shared Files

`css/style.css`, `js/data.js`, `js/common.js`

## Project

Movie-Booking-System
