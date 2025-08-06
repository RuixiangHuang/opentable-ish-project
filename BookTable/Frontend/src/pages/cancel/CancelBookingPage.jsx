import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';
import './CancelBookingPage.css';

const CancelBookingPage = () => {
    const { openingId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [canceled, setCanceled] = useState(false);
    const navigate = useNavigate();

    const handleCancelBooking = async () => {
        const userId = localStorage.getItem('userId');
        setLoading(true);
        try {
            const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENING_CANCEL(openingId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel the booking');
            }

            alert('Booking cancelled successfully!');
            setCanceled(true);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cancel-container">
            <h1 className="cancel-title">Cancel Booking</h1>
            {loading && <div className="cancel-message">Processing cancellation...</div>}
            {error && <div className="cancel-error">Error: {error}</div>}
            {!loading && !error && (
                canceled ? (
                    <p className="cancel-success">Your booking has been successfully cancelled.</p>
                ) : (
                    <div className="cancel-confirm-box">
                        <p className="cancel-question">Are you sure you want to cancel this booking?</p>
                        <button className="cancel-button" onClick={handleCancelBooking}>Cancel Booking</button>
                    </div>
                )
            )}
        </div>
    );
};

export default CancelBookingPage;
