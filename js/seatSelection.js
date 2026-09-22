/**
 * js/seatSelection.js
 * Renders the seat map and handles seat selection interactions.
 */

let currentShow = null;
let currentMovie = null;
let selectedSeats = new Set();
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const SEATS_PER_ROW = 10;

document.addEventListener('DOMContentLoaded', async () => {
    // Requires Auth First
    if (!requireAuth()) return;
    
    renderNavbar('navbar-container');
    
    // Get show ID
    const urlParams = new URLSearchParams(window.location.search);
    let showId = urlParams.get('showId');
    
    if (!showId) {
        showId = getFromLocalStorage('mtbs_selectedShowId');
    }

    if (!showId) {
        document.getElementById('selection-area').innerHTML = '<div class="not-found"><h2>No Show Selected</h2><a href="movies.html" class="btn btn-primary">Browse Movies</a></div>';
        return;
    }

    showId = parseInt(showId);

    // Fetch required data using central accessors
    const localShows = await getShows();
    currentShow = localShows.find(s => s.id === showId);

    if (!currentShow) {
        document.getElementById('selection-area').innerHTML = '<div class="not-found"><h2>Show Not Found</h2></div>';
        return;
    }

    const movies = await getMovies();
    currentMovie = movies.find(m => m.id === currentShow.movieId);

    renderInterface();
});

function renderInterface() {
    const container = document.getElementById('selection-area');
    
    // Header
    const headerHTML = `
        <div class="movie-header">
            <h2>${currentMovie.title}</h2>
            <p class="text-secondary">${currentShow.theatre} | ${currentShow.date} at ${currentShow.time} | ${currentShow.screenType}</p>
        </div>
        <div class="screen"></div>
    `;

    // Generate Seats
    let seatsHTML = '<div class="seats-container">';
    
    ROWS.forEach(row => {
        seatsHTML += `<div class="seat-row"><div class="row-label">${row}</div>`;
        
        for (let i = 1; i <= SEATS_PER_ROW; i++) {
            const seatId = `${row}${i}`;
            const isBooked = currentShow.bookedSeats.includes(seatId);
            const statusClass = isBooked ? 'booked' : 'available';
            
            // Add an aisle after seat 5
            if (i === 6) {
                seatsHTML += `<div class="aisle"></div>`;
            }

            seatsHTML += `<div class="seat ${statusClass}" data-seat="${seatId}" title="${seatId}">${i}</div>`;
        }
        
        seatsHTML += `</div>`;
    });
    
    seatsHTML += '</div>';

    // Legend
    const legendHTML = `
        <div class="legend">
            <div class="legend-item"><div class="seat available"></div> Available</div>
            <div class="legend-item"><div class="seat selected" style="color:transparent"></div> Selected</div>
            <div class="legend-item"><div class="seat booked"></div> Booked</div>
        </div>
    `;

    // Summary Box
    const summaryHTML = `
        <div class="booking-summary card">
            <div class="card-body">
                <h3>Booking Summary</h3>
                <div class="summary-row" style="margin-top: 1rem;">
                    <span>Tickets (0)</span>
                    <span id="summary-seats">None</span>
                </div>
                <div class="summary-row">
                    <span>Price per ticket</span>
                    <span>$${currentShow.price.toFixed(2)}</span>
                </div>
                <div class="summary-row summary-total">
                    <span>Total Amount</span>
                    <span id="summary-total">$0.00</span>
                </div>
                <button id="confirm-btn" class="btn btn-primary btn-block" style="margin-top: 1.5rem;" disabled>Confirm Booking</button>
            </div>
        </div>
    `;

    container.innerHTML = headerHTML + seatsHTML + legendHTML + summaryHTML;

    // Attach Event Listeners to Seats
    document.querySelectorAll('.seat.available').forEach(seat => {
        seat.addEventListener('click', handleSeatClick);
    });

    // Attach Event Listener to Confirm Button
    document.getElementById('confirm-btn').addEventListener('click', handleConfirm);
}

function handleSeatClick(e) {
    const seat = e.target;
    const seatId = seat.getAttribute('data-seat');

    if (seat.classList.contains('booked')) return;

    if (selectedSeats.has(seatId)) {
        selectedSeats.delete(seatId);
        seat.classList.remove('selected');
    } else {
        selectedSeats.add(seatId);
        seat.classList.add('selected');
    }

    updateSummary();
}

function updateSummary() {
    const seatsArray = Array.from(selectedSeats);
    const count = seatsArray.length;
    const total = count * currentShow.price;

    const summarySeatsEl = document.getElementById('summary-seats');
    const summaryTotalEl = document.getElementById('summary-total');
    const confirmBtn = document.getElementById('confirm-btn');

    if (count > 0) {
        summarySeatsEl.innerHTML = seatsArray.join(', ');
        summarySeatsEl.parentElement.firstElementChild.textContent = `Tickets (${count})`;
        summaryTotalEl.textContent = `$${total.toFixed(2)}`;
        confirmBtn.disabled = false;
    } else {
        summarySeatsEl.textContent = 'None';
        summarySeatsEl.parentElement.firstElementChild.textContent = `Tickets (0)`;
        summaryTotalEl.textContent = '$0.00';
        confirmBtn.disabled = true;
    }
}

function handleConfirm() {
    if (selectedSeats.size === 0) return;
    
    const confirmBtn = document.getElementById('confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';

    const success = confirmBooking(currentShow.id, Array.from(selectedSeats), currentMovie.title);
    
    if (!success) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Booking';
    }
}
