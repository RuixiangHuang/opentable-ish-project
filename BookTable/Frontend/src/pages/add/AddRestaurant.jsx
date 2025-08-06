import { useState } from "react";
import "./AddRestaurant.css";
import config from '../../config';

function AddRestaurant() {
  const [formData, setFormData] = useState({
    managerId: 7, // Assuming a manager with ID 1 is adding the restaurant
    isApproved: false, // Default value is false
    address: "",
    city: "",
    state: "",
    zipCode: "",
    name: "",
    cuisine: "",
    costRating: 1,
    timesBooked: 0,
    rating: 4.5,
    reviewNumber: 10,
    contactInfo: "",
    hours: "",
    description: "",
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];
  
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.FILE_UPLOAD}`, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.json();
          uploadedUrls.push(result.data.url);
        } else {
          alert(`Failed to upload file: ${file.name}`);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Upload failed for ${file.name}`);
      }
    }
  
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...uploadedUrls],
    }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANTS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Restaurant created successfully!");
        console.log(data);
      } else {
        alert("Failed to create restaurant.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while creating restaurant.");
    }
  };

  return (
    <div className="add-restaurant-container">
      <h2 className="title">Add a New Restaurant</h2>
      <form onSubmit={handleSubmit} className="restaurant-form">
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
        <input type="text" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="cuisine" placeholder="Cuisine" value={formData.cuisine} onChange={handleChange} required />
        <input type="number" name="costRating" placeholder="Cost Rating (1-5)" value={formData.costRating} onChange={handleChange} required min="1" max="5" />
        <input type="text" name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleChange} required />
        <input type="text" name="hours" placeholder="Hours" value={formData.hours} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

        <div className="photo-upload-section">
          <label>Upload Photos:</label>
          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />

          {formData.photos.length > 0 && (
            <div className="photo-preview">
              <p>Uploaded Photos:</p>
              <ul>
                {formData.photos.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                    <button type="button" onClick={() => handleRemovePhoto(idx)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Add Restaurant</button>
      </form>
    </div>
  );
}

export default AddRestaurant;