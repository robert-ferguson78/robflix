import React from "react";
import { Review } from "../../types/interfaces";

// Define the MovieReview component
const MovieReview: React.FC<Review> = (props) => {
  return (
    <>
      {/* Display the author of the review */}
      <p>Review By: {props.author} </p>
      {/* Display the content of the review */}
      <p>{props.content} </p>
    </>
  );
};

// Export the MovieReview component as the default export
export default MovieReview;