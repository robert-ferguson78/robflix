import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { BaseMovieProps } from "../../types/interfaces";
import { Link } from "react-router-dom";

// Define styles for the button
const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};

// Define the WriteReviewIcon component
const WriteReviewIcon: React.FC<BaseMovieProps> = (movie) => {
  // Check if the movie prop is provided
  if (!movie) {
    console.error("Movie is undefined");
    return null; // Return null or some fallback UI if movie is undefined
  }

  // Render the Link component with the RateReviewIcon
  return (
    <Link
      to={`/reviews/form/${movie.id}`} // Navigate to the review form for the specific movie
      state={{
        movieId: movie.id, // Pass the movie ID as state
      }}
    >
      <RateReviewIcon sx={styles.buttonStyle} fontSize="large" />
    </Link>
  );
};

export default WriteReviewIcon;