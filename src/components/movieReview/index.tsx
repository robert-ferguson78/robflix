import React from "react";
import { Review } from "../../types/interfaces";
import { Grid, Paper } from "@mui/material";

// Define the MovieReview component
const MovieReview: React.FC<Review> = (props) => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Paper style={{ padding: "16px", backgroundColor: "white" }}>
          {/* Display the author of the review */}
          <p>Review By: {props.author} </p>
          {/* Display the content of the review */}
          <p>{props.content} </p>
        </Paper>
      </Grid>
    </Grid>
  );
};

// Export the MovieReview component as the default export
export default MovieReview;