import React, { useEffect, useState } from "react";
import "./ApproveRestaurant.css";
import config from "../../config";

function ApproveRestaurant() {
  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.RESTAURANTS}/unapproved`)
        .then((res) => res.json())
        .then((data) => {
          setRestaurant(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
          `${config.API_BASE_URL}${config.API_ENDPOINTS.APPROVE_RESTAURANT(id)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
      );
      if (response.ok) {
        setMessage(`Restaurant ${id} approved successfully!`);
        setRestaurant((prev) => prev.filter((r) => r.id !== id));
      } else {
        setMessage("Approval failed. Try again.");
      }
    } catch {
      setMessage("Error occurred while approving.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const unapproved = restaurant.filter((r) => !r.isApproved);

  return (
      <div className="approve-page">
        <h2 className="page-title">Pending Restaurant Approvals</h2>
        {message && <p className="message">{message}</p>}
        {unapproved.length === 0 ? (
            <p className="no-result">All restaurants are approved!</p>
        ) : (
            <div className="card-grid">
              {unapproved.map((r) => (
                  <div key={r.id} className="restaurant-card">
                    <div className="card-header">
                      <h3>{r.name}</h3>
                      <span className="card-id">ID: {r.id}</span>
                    </div>
                    <p className="card-desc">{r.description}</p>
                    <div className="card-info">
                      <p><strong>Address:</strong> {r.address}, {r.city}, {r.state}</p>
                      <p><strong>Cuisine:</strong> {r.cuisine}</p>
                      <p><strong>Rating:</strong> {r.rating} ({r.reviewNumber} reviews)</p>
                    </div>
                    {r.photos?.length > 0 && (
                        <div className="card-photos">
                          {r.photos.map((url, idx) => (
                              <img src={url} alt="preview" key={idx} />
                          ))}
                        </div>
                    )}
                    <button className="approve-btn" onClick={() => handleApprove(r.id)}>
                      Approve
                    </button>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

export default ApproveRestaurant;
