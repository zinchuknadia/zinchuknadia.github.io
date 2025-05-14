import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      setRating(0); // Reset after submit
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <p>Rate Your City</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <FaStar
              key={i}
              size={30}
              color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              style={{ cursor: "pointer", transition: "color 200ms" }}
            />
          );
        })}
      </div>
      <button onClick={handleSubmit} style={{ marginTop: "10px", padding: "5px 10px" }}>
        Submit
      </button>
    </div>
  );
};

export default RatingForm;
