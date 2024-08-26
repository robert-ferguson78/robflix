import React from "react";
import FantasyMovieCard from "../fantasyMovieCard/";
import Grid from "@mui/material/Grid";
import { FantasyMovieCardProps } from "../../types/interfaces";

const FantasyMovieList: React.FC<FantasyMovieCardProps> = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <p>No movies available</p>;
  }

  const movieCards = movies.map((m) => (
    <Grid key={m.id} item xs={12} sm={6} md={3} lg={3} xl={3}>
      <FantasyMovieCard key={m.id} movies={m}  />
    </Grid>
  ));

  return (
    <Grid container spacing={2}>
      {movieCards}
    </Grid>
  );
};

export default FantasyMovieList;