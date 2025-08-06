import { useState, useEffect } from "react";
import "./EditRestaurant.css";
import config from '../../config';

function EditRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    name: "",
    cuisine: "",
    costRating: "",
    timesBooked: "",
    contactInfo: "",
    hours: "",
    description: "",
    photos: [],
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANTS}`);
        if (response.ok) {
          const data = await response.json();
          const filteredRestaurants = data.filter(restaurant => 
            restaurant.managerId.toString() === storedUserId
          );
          setRestaurants(filteredRestaurants);
        } else {
          console.error("Failed to fetch restaurants");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storedUserId) {
      fetchRestaurants();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setFieldsToUpdate({
      address: restaurant.address || "",
      city: restaurant.city || "",
      state: restaurant.state || "",
      zipCode: restaurant.zipCode || "",
      name: restaurant.name || "",
      cuisine: restaurant.cuisine || "",
      costRating: restaurant.costRating || "",
      timesBooked: restaurant.timesBooked || "",
      contactInfo: restaurant.contactInfo || "",
      hours: restaurant.hours || "",
      description: restaurant.description || "",
      photos: restaurant.photos || [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldsToUpdate((prev) => ({
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
  
    setFieldsToUpdate((prev) => ({
      ...prev,
      photos: [...prev.photos, ...uploadedUrls],
    }));
  };

  const handleRemovePhoto = (indexToRemove) => {
    setFieldsToUpdate((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      alert("Please select a restaurant to edit");
      return;
    }

    // Filter out empty fields
    const filteredFieldsToUpdate = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, value]) => {
        return value !== "" && !(Array.isArray(value) && value.length === 0);
      })
    );

    // Ensure that photos array only has valid URLs
    filteredFieldsToUpdate.photos = filteredFieldsToUpdate.photos.filter(
      (url) => url && typeof url === "string"
    );

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANT_DETAIL(selectedRestaurant.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredFieldsToUpdate),
      });

      if (response.status === 200) {
        const data = await response.json();
        alert("Restaurant updated successfully!");
        console.log(data);
        
        // Update the restaurants list with the updated data
        setRestaurants(restaurants.map(rest => 
          rest.id === selectedRestaurant.id ? { ...rest, ...filteredFieldsToUpdate } : rest
        ));
      } else {
        const errorData = await response.json();
        alert("Failed to update restaurant: " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while updating restaurant.");
    }
  };

  if (loading) {
    return <div className="edit-restaurant-container">Loading restaurants...</div>;
  }

  return (
    <div className="edit-restaurant-container">
      <h2>Edit Restaurant</h2>

      {!selectedRestaurant ? (
        <div className="restaurant-list">
          <h3>Your Restaurants</h3>
          {restaurants.length === 0 ? (
            <p>No restaurants found for your account</p>
          ) : (
            <ul>
              {restaurants.map((restaurant) => (
                <li key={restaurant.id} className="restaurant-item">
                  <div>
                    <h4>{restaurant.name}</h4>
                    <p>
                      {restaurant.address}, {restaurant.city}, {restaurant.state}{" "}
                      {restaurant.zipCode}
                    </p>
                    <p>Cuisine: {restaurant.cuisine}</p>
                    {restaurant.photos.length > 0 ? (
                      <div className="restaurant-photos">
                        {restaurant.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`${restaurant.name} photo ${index + 1}`}
                            className="restaurant-thumbnail"
                          />
                        ))}
                      </div>
                    ) : (
                      <p>No photos available</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className="select-btn"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="back-btn"
          >
            ← Back to List
          </button>

          <form onSubmit={handleSubmit} className="restaurant-form">
            <h3>Editing: {selectedRestaurant.name}</h3>
            
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={fieldsToUpdate.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={fieldsToUpdate.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={fieldsToUpdate.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={fieldsToUpdate.state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={fieldsToUpdate.zipCode}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cuisine"
              placeholder="Cuisine"
              value={fieldsToUpdate.cuisine}
              onChange={handleChange}
            />
            <input
              type="number"
              name="costRating"
              placeholder="Cost Rating"
              value={fieldsToUpdate.costRating}
              onChange={handleChange}
            />
            <input
              type="number"
              name="timesBooked"
              placeholder="Times Booked"
              value={fieldsToUpdate.timesBooked}
              onChange={handleChange}
            />
            <input
              type="text"
              name="contactInfo"
              placeholder="Contact Info"
              value={fieldsToUpdate.contactInfo}
              onChange={handleChange}
            />
            <input
              type="text"
              name="hours"
              placeholder="Hours"
              value={fieldsToUpdate.hours}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={fieldsToUpdate.description}
              onChange={handleChange}
            />

            <label>Current Photos:</label>
            <div className="photo-preview">
              {fieldsToUpdate.photos.length > 0 ? (
                <div className="photo-grid">
                  {fieldsToUpdate.photos.map((url, idx) => (
                    <div key={idx} className="photo-item">
                      <img 
                        src={url} 
                        alt={`Restaurant photo ${idx + 1}`} 
                        className="photo-thumbnail"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="remove-photo-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No photos</p>
              )}
            </div>

            <label>Upload New Photos:</label>
            <input
              type="file"
              name="photos"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />

            <button type="submit" className="submit-btn">
              Update Restaurant
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default EditRestaurant;