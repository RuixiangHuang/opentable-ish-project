import React, { useEffect, useState } from 'react';
import './RestaurantReviews.css';
import {useSearchParams} from "react-router-dom";
import {renderStars} from "../search/SearchPage";
import config from '../../config';

const RestaurantReviews = ({ restaurantId = 1 }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const fetchReviews = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const id = searchParams.get('id');
      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANT_REVIEWS(id)}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.data || []);
      console.log('reviews: ', reviews)
      setTotalPages(data.totalPages || 1);
      setPage(data.number || 0);
    } catch (error) {
      console.error(error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, []);

  const handleNext = () => {
    if (page + 1 < totalPages) fetchReviews(page + 1);
  };

  const handlePrevious = () => {
    if (page > 0) fetchReviews(page - 1);
  };

  return (
    <div className="reviews-container">
      <h2>{searchParams.get('name')} Reviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <>
          <ul className="review-list">
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <p><strong>User:</strong> {review.user.username}</p>
                <p><strong>Rating:</strong> {renderStars(review.rating)}</p>
                <p><strong>Comment:</strong> {review.text}</p>
              </li>
            ))}
          </ul>
          <div className="pagination-controls">
            <button onClick={handlePrevious} disabled={page === 0}>Previous</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button onClick={handleNext} disabled={page + 1 >= totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantReviews;
