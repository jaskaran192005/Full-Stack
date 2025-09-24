const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// Sample in-memory seat map (seat numbers 1 to 10)
let seats = {};
for (let i = 1; i <= 10; i++) {
    seats[i] = { status: 'available', lockedBy: null, lockTime: null };
}

// Lock expiration time in milliseconds (1 minute)
const LOCK_EXPIRATION = 60000;

// available seats
app.get('/seats', (req, res) => {
    const availableSeats = Object.keys(seats).filter(
        seat => seats[seat].status === 'available' || (seats[seat].status === 'locked' && isLockExpired(seats[seat]))
    );
    res.json({ availableSeats });
});

// Helper function to check if a lock has expired
function isLockExpired(seat) {
    if (seat.status !== 'locked') return false;
    return (Date.now() - seat.lockTime) > LOCK_EXPIRATION;
}



//lock a seat
app.post('/lock', (req, res) => {
    const { seatNumber, user } = req.body;
    const seat = seats[seatNumber];

    if (!seat) return res.status(400).json({ message: 'Invalid seat number' });
    if (seat.status === 'booked') return res.status(400).json({ message: 'Seat already booked' });

    // If seat is locked and not expired
    if (seat.status === 'locked' && !isLockExpired(seat)) {
        return res.status(400).json({ message: `Seat ${seatNumber} is already locked` });
    }

    // Lock the seat
    seat.status = 'locked';
    seat.lockedBy = user;
    seat.lockTime = Date.now();

    // Auto-release lock after expiration
    setTimeout(() => {
        if (seat.status === 'locked' && isLockExpired(seat)) {
            seat.status = 'available';
            seat.lockedBy = null;
            seat.lockTime = null;
            console.log(`Seat ${seatNumber} lock expired`);
        }
    }, LOCK_EXPIRATION);

    res.json({ message: `Seat ${seatNumber} locked successfully for ${user}` });
});



//confirm booking
app.post('/confirm', (req, res) => {
    const { seatNumber, user } = req.body;
    const seat = seats[seatNumber];

    if (!seat) return res.status(400).json({ message: 'Invalid seat number' });
    if (seat.status !== 'locked') return res.status(400).json({ message: 'Seat is not locked' });
    if (seat.lockedBy !== user) return res.status(400).json({ message: 'You do not own the lock for this seat' });

    // Confirm the booking
    seat.status = 'booked';
    seat.lockedBy = null;
    seat.lockTime = null;

    res.json({ message: `Seat ${seatNumber} booked successfully by ${user}` });
});



//server start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
