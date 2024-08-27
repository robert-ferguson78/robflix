import React from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "../components/movieDetails";
import PageTemplate from "../components/templateMoviePage";
import { getMovie } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
import { MovieDetailsProps } from "../types/interfaces";
import { useLanguage } from '../contexts/languageContext';

// Component to display the details of a specific movie
const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the movie ID from the URL parameters
  const { language } = useLanguage(); // Get the current language from context
  console.log("Current language in MovieDetailsPage:", language); // Log the language value

  // Query to fetch movie details using react-query
  const { data: movie, error, isLoading, isError } = useQuery<MovieDetailsProps, Error>(
    ["movie", id, language],
    () => getMovie(id || "", language)
  );

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Show error message if there's an error
  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  // Render the page template with the movie details
  return (
    <>
      {movie ? (
        <PageTemplate movie={movie}> 
          <MovieDetails {...movie} />
        </PageTemplate>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MovieDetailsPage;