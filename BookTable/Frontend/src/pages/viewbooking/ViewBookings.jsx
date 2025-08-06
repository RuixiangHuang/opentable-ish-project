import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewBookings.css';
import config from "../../config";

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const fetchBookings = async () => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/openings/list/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            const data = await response.json();
            setBookings(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (openingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENING_CANCEL(openingId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            // Refresh the bookings list after successful cancellation
            fetchBookings();
            alert('Booking cancelled successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [userId]);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="view-bookings-container">
            <h1 className="page-title">Your Bookings</h1>
            <button 
                className="refresh-btn"
                onClick={fetchBookings}
                disabled={loading}
            >
                {loading ? 'Refreshing...' : 'Refresh Bookings'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {loading && bookings.length === 0 ? (
                <div className="loading-message">Loading your bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="no-bookings">You don't have any bookings yet.</div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <h2 className="restaurant-name">{booking.restaurant.name}</h2>
                                <span className={`status-badge ${booking.arrived ? 'arrived' : 'pending'}`}>
                                    {booking.arrived ? 'Arrived' : 'Confirmed'}
                                </span>
                            </div>
                            
                            <div className="booking-details">
                                <div className="detail-row">
                                    <span className="detail-label">Date & Time:</span>
                                    <span>{formatDateTime(booking.dateTime)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Party Size:</span>
                                    <span>{booking.numPeople} people</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Location:</span>
                                    <span>
                                        {booking.restaurant.address}, {booking.restaurant.city}, {booking.restaurant.state} {booking.restaurant.zipCode}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Contact:</span>
                                    <span>{booking.restaurant.contactInfo}</span>
                                </div>
                            </div>

                            <div className="booking-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={booking.arrived}
                                >
                                    {booking.arrived ? 'Already Arrived' : 'Cancel Booking'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewBookings;