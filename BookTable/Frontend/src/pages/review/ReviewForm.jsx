import { useState } from "react";
import "./ReviewForm.css";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const review = {
      text,
      rating,
      user: { id: 7 },
      restaurant: { id: 1 },
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit review", await res.text());
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="review-form-container">
      <h2>Write a Review</h2>
      {submitted ? (
        <p className="review-success">Thanks for your review!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} Star{val > 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="text">Your Review</label>
            <textarea
              id="text"
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
}
