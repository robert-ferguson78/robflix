import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { BaseMovieProps } from "../../types/interfaces";
import { Link } from "react-router-dom";

const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};


const WriteReviewIcon: React.FC<BaseMovieProps> = (movie) => {
  if (!movie) {
    console.error("Movie is undefined");
    return null; // or return some fallback UI
  }

  return (
    <Link
      to={`/reviews/form/${movie.id}`}
      state={{
        movieId: movie.id,
      }}
    >
      <RateReviewIcon sx={styles.buttonStyle} fontSize="large" />
    </Link>
  );
};

export default WriteReviewIcon;