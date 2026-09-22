# Movie Ticket Booking System

A vanilla HTML, CSS, and JavaScript based web application for booking movie tickets.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: JSON (simulated via LocalStorage/Fetch for frontend operations)

## Folder Structure
```text
.
├── assets/                  # Images and other static assets
├── css/                     # CSS stylesheets
├── data/                    # JSON data files (movies, shows, users)
├── js/                      # JavaScript logic files
├── index.html               # Homepage
├── movies.html              # Movies listing page
├── movie-details.html       # Individual movie details
├── seat-selection.html      # Seat selection layout
├── login.html               # User login
├── signup.html              # User signup
├── admin-dashboard.html     # Admin dashboard for management
├── booking-confirmation.html# Booking confirmation receipt
├── README.md                # Project documentation
└── .gitignore               # Git ignore rules
```

## Team

- **Team Lead**: [Name Placeholder]
- **Frontend UI/UX**: [Name Placeholder]
- **Booking Logic**: [Name Placeholder]
- **Admin Panel + Data**: [Name Placeholder]

## Git Branching Strategy

For our 4-person team, we will use a **Feature Branch Workflow**:
1. **Main Branch**: `main` is our production-ready code. No direct commits are allowed to `main`.
2. **Branch Naming**: Each member creates a branch based on their role/feature. Format: `feature/<role>-<task>` (e.g., `feature/ui-seat-map`, `feature/logic-booking`).
3. **Pull Requests (PR)**: Once a feature is complete, push the branch and open a PR against `main`.
4. **Code Review**: At least one other team member (preferably the Team Lead) must review and approve the PR before it can be merged.
5. **Merge**: Once approved, use "Squash and Merge" to keep the `main` history clean.

## Full User Flow Testing Checklist

Before submitting a PR, ensure the following core workflow is fully functional:

- [ ] **Account Creation**: A new user can sign up on `signup.html` without errors, and it redirects to login.
- [ ] **Authentication**: The user can log in with their new credentials on `login.html`.
- [ ] **Navigation**: The navbar successfully switches from "Login/Signup" to "Hi, [User]" and "Logout".
- [ ] **Browsing**: The user can navigate to `movies.html`, search by title, and filter by genre successfully.
- [ ] **Movie Details**: Clicking a movie correctly loads its details and available grouped showtimes.
- [ ] **Seat Selection**: Selecting a showtime routes to the seat map. Clicking seats updates the live price accurately.
- [ ] **Booking**: Confirming a booking successfully redirects to `booking-confirmation.html` displaying the correct details.
- [ ] **Admin Verification**: Logging out and logging in as `admin` allows access to `admin-dashboard.html`, where the new booking is visible. Adding/editing a movie in the admin panel immediately reflects on the frontend.
