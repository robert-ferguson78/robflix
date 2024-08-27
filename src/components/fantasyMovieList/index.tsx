import React from "react";
import FantasyMovieCard from "../fantasyMovieCard/";
import Grid from "@mui/material/Grid";
import { FantasyMovieCardProps } from "../../types/interfaces";

// Define the FantasyMovieList component
const FantasyMovieList: React.FC<FantasyMovieCardProps> = ({ movies }) => {
  // Check if there are no movies to display
  if (!movies || movies.length === 0) {
    return <p>No movies available</p>;
  }

  // Map over the movies array to create a list of FantasyMovieCard components
  const movieCards = movies.map((m) => (
    <Grid key={m.id} item xs={12} sm={6} md={3} lg={3} xl={3}>
      <FantasyMovieCard key={m.id} movies={m} />
    </Grid>
  ));

  // Render the list of movie cards inside a Grid container
  return (
    <Grid container spacing={2}>
      {movieCards}
    </Grid>
  );
};

export default FantasyMovieList;