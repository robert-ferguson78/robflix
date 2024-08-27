import React from "react";
import Movie from "../movieCard/";
import Grid from "@mui/material/Grid";
import { BaseMovieListProps } from "../../types/interfaces";

// Define the MovieList component
const MovieList: React.FC<BaseMovieListProps> = ({ movies, action }) => {
  // Map through the movies array to create a list of movie cards
  const movieCards = movies.map((m) => (
    // Each movie card is wrapped in a Grid item for responsive layout
    <Grid key={m.id} item xs={12} sm={6} md={3} lg={3} xl={3}>
      <Movie key={m.id} movie={m} action={action} />
    </Grid>
  ));

  // Return the list of movie cards
  return movieCards;
}

// Export the MovieList component as the default export
export default MovieList;