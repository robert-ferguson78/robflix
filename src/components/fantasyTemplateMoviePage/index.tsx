import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import FantasyMovieList from "../fantasyMovieList";
import { MovieListPageTemplateProps } from "../../types/interfaces";

const styles = {
  root: { 
    backgroundColor: "#bfbfbf",
  }
};

const FantasyTemplateMoviePage: React.FC<MovieListPageTemplateProps> = ({ movies, title }) => {
  console.log("FantasyTemplateMoviePage: movies:", movies);

  return (
    <Grid container sx={styles.root}>
      <Grid item xs={12}>
        <Header title={title} />
      </Grid>
      <Grid item xs={12}>
        <FantasyMovieList movies={movies} />
      </Grid>
    </Grid>
  );
}

export default FantasyTemplateMoviePage;