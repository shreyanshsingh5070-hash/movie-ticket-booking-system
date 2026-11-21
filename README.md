# Member 1 - Shreyansh

**Responsibility:** Home page, movie listing (search + filters), movie details + reviews
# Member 3 - Somyani

**Responsibility:** Register, login, profile, booking history + cancellation

## Files

| File | Purpose |
|---|---|
<<<<<<< HEAD
| `index.html` + `js/home.js` | Banner slider (top 3 rated), quick search, Now Showing, Coming Soon |
| `movies.html` + `js/movies.js` | Complete movie list, search, language / genre / status filters, sorting |
| `movie.html` + `js/movie-details.js` | Movie details, trailer button, submitting and viewing reviews |
=======
| `register.html` + `js/auth.js` | Creating a new account (with validation) |
| `login.html` + `js/auth.js` | Login, show/hide password, `?next=` redirect |
| `profile.html` + `js/profile.js` | Edit details, change password, bookings and total spent |
| `history.html` + `js/history.js` | Upcoming / Past / Cancelled bookings, view ticket, cancel |
>>>>>>> origin/somyani

Shared files (identical across all members): `css/style.css`, `js/data.js`, `js/common.js`

## Features

<<<<<<< HEAD
- Banner slider showing the 3 highest-rated movies
- Search by title, cast or director (results update as you type)
- Language dropdown, genre chips, Now Showing / Coming Soon filter, sorting (rating / A-Z / duration)
- Movie details: poster, certificate, duration, cast, director, description
- "Watch Trailer" opens a YouTube search
- Reviews: logged-in users can submit a star rating and feedback (minimum 5 characters)

## Main Functions

- `applyFilters()` (movies.js) - applies all filters and redraws the grid
- `movieCardHTML()` (common.js) - generates the movie card HTML, used on both the home and movies pages
- `drawReviews()`, `drawReviewForm()` (movie-details.js)

## Note

This folder contains only Shreyansh's pages. Links such as "Book Tickets" and "Login" point to pages
belonging to other members, which are not included here. **Use the full project package (`CineBook_Full_Project.zip`) to see the complete flow.**
=======
- Register: name (3+ characters), valid email, mobile number (10 digits, starting with 6-9), password (6+ characters), confirm password
- A second account cannot be created with the same email
- After login, the user returns to the page they came from (`?next=`); only pages on this site are allowed
- Profile: name and mobile number can be changed, but not the email. Changing the password requires the current password
- My Bookings: 3 tabs, with a ticket button on every booking
- Cancellation: allowed up to **2 hours before** the show. The seats are released immediately

## Main Functions

- `currentUser()`, `requireLogin()`, `logoutUser()` (common.js) - session handling
- `getNextPage()` (auth.js) - safe redirect
- `canCancel()`, `draw()` (history.js)

## Note

The "Ticket" button leads to Shubham's `confirm.html`, and some navbar links lead to Shreyansh's pages,
which are not included in this folder. **Open `full_project` to see the complete flow.**
The Register / Login / Profile pages also work on their own within this folder.
>>>>>>> origin/somyani
