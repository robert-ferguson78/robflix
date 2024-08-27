import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import FantasyMovieList from "../fantasyMovieList";
import { FantasyMovieCardProps } from "../../types/interfaces";

// Define styles for the root container
const styles = {
  root: { 
    backgroundColor: "#bfbfbf",
  }
};

// Define the FantasyTemplateMoviePage component
const FantasyTemplateMoviePage: React.FC<FantasyMovieCardProps> = ({ movies, title }) => {
  // Log the movies prop for debugging purposes
  console.log("FantasyTemplateMoviePage: movies:", movies);

  return (
    // Container for the entire page with custom background color
    <Grid container sx={styles.root}>
      {/* Header section */}
      <Grid item xs={12}>
        <Header title={title || "Fantasy Movies"} />
      </Grid>
      {/* Movie list section */}
      <Grid item xs={12}>
        <FantasyMovieList movies={movies} />
      </Grid>
    </Grid>
  );
}

export default FantasyTemplateMoviePage;