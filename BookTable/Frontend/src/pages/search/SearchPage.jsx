import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchPage.css';
import config from '../../config';

export const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push('★');
        } else if (rating >= i - 0.5) {
            stars.push('☆');
        } else {
            stars.push('☆');
        }
    }
    return stars.join('');
};

const SearchPage = () => {
    const [openings, setOpenings] = useState([]);
    const [timesBookedMap, setTimesBookedMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const getQueryParams = () => {
        const queryParams = new URLSearchParams(location.search);
        return {
            date: queryParams.get('date'),
            time: queryParams.get('time'),
            people: queryParams.get('people'),
            query: queryParams.get('query'),
        };
    };

    useEffect(() => {
        const { date, time, people, query } = getQueryParams();
        const dateTime = `${date}T${time}:00`;

        const payload = {
            numPeople: people,
            dateTime,
            people,
            query,
        };

        const fetchOpenings = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENING_SEARCH}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error('Failed to fetch openings');

                const data = await response.json();

                if (Array.isArray(data.data)) {
                    const formatted = data.data.map(({ restaurant, openings: slots }) => ({
                        id: restaurant.id,
                        name: restaurant.name,
                        rating: restaurant.rating,
                        reviewNumber: restaurant.reviewNumber,
                        costRating: restaurant.costRating,
                        cuisine: restaurant.cuisine,
                        city: restaurant.city,
                        photo: restaurant.photos?.[0],
                        openingTimes: slots
                            .filter((slot) => slot.user === null)
                            .map((slot) => ({
                                id: slot.id,
                                dateTime: slot.dateTime,
                                userId: slot.userId,
                            })),
                    }));
                    setOpenings(formatted);
                } else {
                    setError('Invalid response format');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOpenings();
    }, [location.search]);

    useEffect(() => {
        if (openings.length === 0) return;

        const todayDate = new Date().toISOString().slice(0, 10);
        openings.forEach(r => {
            fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENING_BOOK_TODAY(r.id, todayDate)}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch booked');
                    return res.json();
                })
                .then(count => {
                    setTimesBookedMap(prev => ({ ...prev, [r.id]: count }));
                })
                .catch(err => {
                    console.error(`Error fetching booked for ${r.id}:`, err);
                });
        });
    }, [openings]);

    const handleBooking = async (openingId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENING_BOOK(openingId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to book');
            }

            alert('Booking successful!');
        } catch (err) {
            alert('Error booking slot: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="search-results-container">
            <h1>Search Results</h1>
            {openings.length === 0 ? (
                <p>No openings found.</p>
            ) : (
                openings.map((r) => (
                    <div key={r.id} className="restaurant-card">
                        {r.photo && (
                            <div className="restaurant-image-container">
                                <img src={r.photo} alt={r.name} className="restaurant-image" />
                            </div>
                        )}
                        <div className="card-header">
                            <a href={`/restaurantPage?id=${r.id}`} className="restaurant-name">
                                {r.name}
                            </a>
                            <div className="rating-group">
                                <span className="stars">{renderStars(r.rating)}</span>
                                <span className="rating-text">({r.reviewNumber})</span>
                            </div>
                        </div>

                        <div className="meta">
                            {'$'.repeat(r.costRating)} &nbsp;•&nbsp; {r.cuisine} &nbsp;•&nbsp; {r.city}
                        </div>
                        <div className="booked-info">
                            {timesBookedMap[r.id] != null
                                ? `Booked ${timesBookedMap[r.id].data} time(s) Today`
                                : 'Fetching booked count...'}
                        </div>

                        <div className="time-slots">
                            {r.openingTimes.length === 0 ? (
                                <p className="no-times">No available times</p>
                            ) : (
                                r.openingTimes.map((slot) => {
                                    const time = new Date(slot.dateTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    });

                                    return (
                                        <div key={slot.id} className="slot">
                                            <button onClick={() => handleBooking(slot.id)}>{time}</button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchPage;
