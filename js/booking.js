/**
 * js/booking.js
 * Handles core booking creation, cancellation, and local shows state management.
 */

/**
 * Creates a booking and updates the show's booked seats.
 */
async function confirmBooking(showId, selectedSeats, movieTitle) {
    // 1. Require Auth
    const user = getCurrentUser();
    if (!user) {
        // Redirection is handled by requireAuth(), but we explicitly stop here
        return false;
    }

    if (!selectedSeats || selectedSeats.length === 0) {
        showToast('Please select at least one seat', 'error');
        return false;
    }

    // 2. Load Local Shows
    const localShows = await getShows();
    const showIndex = localShows.findIndex(s => s.id === showId);
    
    if (showIndex === -1) {
        showToast('Show not found', 'error');
        return false;
    }

    const show = localShows[showIndex];
    
    // 3. Verify seats are still available (double-check)
    const alreadyBooked = selectedSeats.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
        showToast('One or more selected seats were just booked by someone else!', 'error');
        return false;
    }

    // 4. Update Show Data
    show.bookedSeats.push(...selectedSeats);
    localShows[showIndex] = show;
    saveToLocalStorage('mtbs_shows', localShows);

    // 5. Create Booking Record
    let bookings = await getBookings();
    
    const totalPrice = selectedSeats.length * show.price;
    const bookingId = 'BK-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000);
    
    const newBooking = {
        bookingId,
        userId: user.username,
        showId: show.id,
        movieTitle: movieTitle,
        date: show.date,
        time: show.time,
        theatre: show.theatre,
        seats: selectedSeats,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveToLocalStorage('mtbs_bookings', bookings);

    showToast('Booking confirmed successfully!', 'success');
    
    // 6. Redirect to confirmation
    setTimeout(() => {
        window.location.href = `booking-confirmation.html?bookingId=${bookingId}`;
    }, 1000);

    return true;
}

/**
 * Cancels a booking and frees up the seats.
 */
async function cancelBooking(bookingId) {
    let bookings = await getBookings();
    const bookingIndex = bookings.findIndex(b => b.bookingId === bookingId);
    
    if (bookingIndex === -1) {
        showToast('Booking not found', 'error');
        return false;
    }

    const booking = bookings[bookingIndex];

    // Free seats in localShows
    const localShows = await getShows();
    const showIndex = localShows.findIndex(s => s.id === booking.showId);
    
    if (showIndex !== -1) {
        const show = localShows[showIndex];
        show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
        localShows[showIndex] = show;
        saveToLocalStorage('mtbs_shows', localShows);
    }

    // Remove booking
    bookings.splice(bookingIndex, 1);
    saveToLocalStorage('mtbs_bookings', bookings);
    
    showToast('Booking cancelled successfully', 'success');
    return true;
}
