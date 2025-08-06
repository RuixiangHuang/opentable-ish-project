import React, { useState } from 'react';
import config from '../../config';

const EditOpening = () => {
  const [openingId, setOpeningId] = useState('');
  const [opening, setOpening] = useState({
    restaurantId: '',
    dateTime: '',
    numPeople: '',
    userId: ''
  });
  const [error, setError] = useState('');

  const handleOpeningIdChange = (e) => {
    setOpeningId(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOpening((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct request body in the format your backend expects
    const requestBody = {
      restaurant: { id: parseInt(opening.restaurantId, 10) },
      dateTime: opening.dateTime,
      numPeople: parseInt(opening.numPeople, 10),
      user: opening.userId ? { id: parseInt(opening.userId, 10) } : null
    };

    fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENING_DETAIL(openingId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error updating opening.');
        }
        return response.json();
      })
      .then(() => {
        alert('Opening updated successfully!');
      })
      .catch((error) => {
        setError(error.message || 'Error updating opening.');
      });
  };

  return (
    <div className="create-opening-container">
      <h2>Edit Opening</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="opening-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="openingId">Opening ID</label>
          <input
            type="text"
            id="openingId"
            name="openingId"
            value={openingId}
            onChange={handleOpeningIdChange}
            placeholder="Enter opening ID"
            required
          />
        </div>
        <div>
          <label htmlFor="restaurantId">Restaurant ID</label>
          <input
            type="text"
            id="restaurantId"
            name="restaurantId"
            value={opening.restaurantId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dateTime">Date & Time</label>
          <input
            type="text"
            id="dateTime"
            name="dateTime"
            placeholder="e.g. 2025-05-05T19:00:00"
            value={opening.dateTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="numPeople">Number of People</label>
          <input
            type="number"
            id="numPeople"
            name="numPeople"
            value={opening.numPeople}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={opening.userId}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-btn">
          Update Opening
        </button>
      </form>
    </div>
  );
};

export default EditOpening;
