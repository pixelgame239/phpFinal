import React from 'react';
import "../styles/foodReviews.css"; // You can style this section

const reviewsData = [
  {
    id: 1,
    foodName: "Pho Bo",
    reviewer: "John Doe",
    rating: 5,
    comment: "The best Pho I've had! The broth is so flavorful, and the beef is tender.",
  },
  {
    id: 2,
    foodName: "Banh Mi",
    reviewer: "Jane Smith",
    rating: 4,
    comment: "A delicious sandwich with the right balance of flavors. A little spicy, but great!",
  },
  {
    id: 3,
    foodName: "Goi Cuon",
    reviewer: "Michael Lee",
    rating: 4.5,
    comment: "These spring rolls were fresh and packed with flavors! I love the peanut dipping sauce.",
  },
  {
    id: 4,
    foodName: "Com tam",
    reviewer: "Sara Tan",
    rating: 3.5,
    comment: "Good taste but I expected more seasoning. The grilled pork was tender.",
  },
];

const FoodReviews = () => {
  return (
    <div className="food-reviews-container">
      <h2 className="section-title">Customer Reviews</h2>
      <div className="reviews-list">
        {reviewsData.map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.foodName}</h3>
            <div className="review-details">
              <p><strong>{review.reviewer}</strong> - Rating: {review.rating}⭐</p>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodReviews;
