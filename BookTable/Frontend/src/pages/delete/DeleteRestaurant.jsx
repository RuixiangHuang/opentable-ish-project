import { useState, useEffect } from "react";
import "./DeleteRestaurant.css";
import config from '../../config';

function DeleteRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/restaurants`);
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          console.error("Failed to fetch restaurants");
          setMessage("Failed to load restaurants. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setMessage("Error occurred while loading restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleDelete = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.REMOVE_RESTAURANT(restaurantId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessage("Restaurant deleted successfully!");
        setRestaurants(restaurants.filter(rest => rest.id !== restaurantId));
      } else {
        setMessage("Failed to delete restaurant. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error occurred while deleting restaurant.");
    }
  };

  if (loading) {
    return <div className="delete-restaurant-container">Loading restaurants...</div>;
  }

  return (
    <div className="delete-restaurant-container">
      <h2 className="title">Delete Restaurant</h2>
      {message && <p className="message">{message}</p>}

      <div className="restaurant-list">
        <h3>Select a Restaurant to Delete</h3>
        {restaurants.length === 0 ? (
          <p>No restaurants found</p>
        ) : (
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} className="restaurant-item">
                <div className="restaurant-info">
                  <h4>{restaurant.name}</h4>
                  <p>
                    {restaurant.address}, {restaurant.city}, {restaurant.state}{" "}
                    {restaurant.zipCode}
                  </p>
                  <p>Cuisine: {restaurant.cuisine}</p>
                  {restaurant.photos.length > 0 && (
                    <img
                      src={restaurant.photos[0]}
                      alt={restaurant.name}
                      className="restaurant-thumbnail"
                    />
                  )}
                </div>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DeleteRestaurant;