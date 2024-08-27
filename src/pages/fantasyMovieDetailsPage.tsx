import React from "react";
import { useParams } from "react-router-dom";
import FantasyMovieDetails from "../components/fantasyMovieDetails";
import { fantasyMovieFirestoreStore } from "../models/fantasy-movie-firestore-store";
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
import { FantasyMovieProps } from "../types/interfaces";

// Component to display details of a fantasy movie
const FantasyMovieDetailsPage: React.FC = () => {
  const { id } = useParams(); // Get the movie ID from the URL parameters
  console.log("FantasyMovieDetailsPage: id:", id);

  // Fetch movie details using react-query
  const { data: movie, error, isLoading, isError } = useQuery<FantasyMovieProps, Error>(
    ["fantasyMovie", id],
    async () => {
      console.log("Fetching movie details for id:", id);
      const movieData = await fantasyMovieFirestoreStore.getFantasyMovie(id || "");
      console.log("Fetched movie data:", movieData);
      return { ...movieData, id: id || "" } as FantasyMovieProps;
    }
  );

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Show error message if there's an error
  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  // Show a waiting message if no movie data is available
  if (!movie) {
    return <p>Waiting for movie details</p>;
  }

  // Render the movie details component with the fetched movie data
  return <FantasyMovieDetails {...movie} />;
};

export default FantasyMovieDetailsPage;