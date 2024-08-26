import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import MovieList from "../movieList";
import { MovieListPageTemplateWithPaginationProps } from "../../types/interfaces";

const styles = {
  root: { 
    backgroundColor: "#000000",
  }
};

const MovieListPageTemplate: React.FC<MovieListPageTemplateWithPaginationProps> = ({ movies, title, action, page, setPage, isFetching, totalPages }) => {
  return (
    <Grid container sx={styles.root}>
      <Grid item xs={12}>
        <Header 
          title={title} 
          page={page} 
          setPage={setPage} 
          isFetching={isFetching} 
          totalPages={totalPages} 
        />
      </Grid>
      <Grid item container spacing={5}>
        <MovieList action={action} movies={movies}></MovieList>
      </Grid>
    </Grid>
  );
};

export default MovieListPageTemplate;