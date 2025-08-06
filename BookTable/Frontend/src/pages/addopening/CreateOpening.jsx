import React, { useState } from "react";
import "./CreateOpening.css";
import config from '../../config';

const CreateOpening = () => {
  const [formData, setFormData] = useState({
    time: "",
    numSeat: "",
    userId: "",
    restaurantId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isoDate = new Date(formData.time);
    if (isNaN(isoDate.getTime())) {
      alert("Invalid ISO 8601 date format.");
      return;
    }
  
    const payload = {
      dateTime: isoDate.toISOString(),
      numPeople: parseInt(formData.numSeat),
      restaurant: {
        id: parseInt(formData.restaurantId),
      },
      arrived: false,
    };
  
    // Only include the user field if userId is provided
    if (formData.userId.trim() !== "") {
      payload.user = { id: parseInt(formData.userId) };
    }
  
    console.log("Payload to be sent:", payload);
  
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.OPENINGS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to create opening");
  
      const data = await response.json();
      alert("Opening created successfully!");
      console.log(data);
    } catch (err) {
      console.error("Error creating opening:", err);
      alert("Error creating opening");
    }
  };
  

  return (
    <div className="create-opening-container">
      <h2>Create Opening</h2>
      <form onSubmit={handleSubmit} className="opening-form">
        <input
        type="text"
        name="time"
        placeholder="Time (e.g., 2025-05-03T20:53:39.273Z)"
        value={formData.time}
        onChange={handleChange}
        required
        />
        <input
          type="number"
          name="numSeat"
          placeholder="Number of Seats"
          value={formData.numSeat}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
        />
        <input
          type="number"
          name="restaurantId"
          placeholder="Restaurant ID"
          value={formData.restaurantId}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">Create Opening</button>
      </form>
    </div>
  );
};

export default CreateOpening;
