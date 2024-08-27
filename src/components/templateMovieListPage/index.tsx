import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import MovieList from "../movieList";
import { MovieListPageTemplateWithPaginationProps } from "../../types/interfaces";

// Define styles for the root container
const styles = {
  root: { 
    backgroundColor: "#000000",
  }
};

// Main component for the movie list page with pagination
const MovieListPageTemplate: React.FC<MovieListPageTemplateWithPaginationProps> = ({ movies, title, action, page, setPage, isFetching, totalPages }) => {
  return (
    // Root container with defined styles
    <Grid container sx={styles.root}>
      {/* Header section */}
      <Grid item xs={12}>
        <Header 
          title={title} 
          page={page} 
          setPage={setPage} 
          isFetching={isFetching} 
          totalPages={totalPages} 
        />
      </Grid>
      {/* Movie list section */}
      <Grid item container spacing={5}>
        <MovieList action={action} movies={movies}></MovieList>
      </Grid>
    </Grid>
  );
};

export default MovieListPageTemplate;