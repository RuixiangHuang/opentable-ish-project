import React, { useEffect, useState } from "react";
import MapPage from "../map/MapPage";
import './restaurant.css';
import { useSearchParams } from "react-router-dom";
import config from '../../config';

function RestaurantPage() {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('id');
        console.log('ID: ', id);
        fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANT_DETAIL(id)}`)
            .then((res) => res.json())
            .then((data) => {
                setRestaurant(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="text-xl">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="text-xl text-red-500">Error loading restaurant.</span>
            </div>
        );
    }

    if (!restaurant) return null;

    const getPriceRange = (costRating) => {
        switch (costRating) {
            case 1: return "$";
            case 2: return "$$";
            case 3: return "$$$";
            case 4: return "$$$$";
            default: return "$";
        }
    };

    return (
        <div className="restaurant-container">
            <div className="photo-gallery">
                {restaurant.photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={`restaurant ${index + 1}`}
                        className="gallery-image"
                    />
                ))}
            </div>
            <h1 className="restaurant-title">{restaurant.name}</h1>

            <div className="restaurant-details">
                <div>{parseFloat(restaurant.rating)} out of 5 stars</div>
                <a href={`/reviews?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}`}>
                    {restaurant.reviewNumber} Reviews
                </a>
                <div>Cost: {getPriceRange(restaurant.costRating)}</div>
                <div>Cuisine: {restaurant.cuisine}</div>

                <section>
                    <h1>About this restaurant</h1>
                    <div>{restaurant.description}</div>
                </section>

                <div>Hours of Operation: {restaurant.hours}</div>
                <div>Contact Info: {restaurant.contactInfo}</div>
            </div>

            <div className="map-section">
                <MapPage id={restaurant.id} />
            </div>
        </div>
    );
}

export default RestaurantPage;
