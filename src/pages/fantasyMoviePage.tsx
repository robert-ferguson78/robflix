import React from "react";
import FantasyTemplateMoviePage from '../components/fantasyTemplateMoviePage';
import { FantasyMovieProps } from "../types/interfaces";
import { fantasyMovieFirestoreStore } from "../models/fantasy-movie-firestore-store";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";

// Function to fetch all fantasy movies from the Firestore store
const fetchAllFantasyMovies = async (): Promise<FantasyMovieProps[]> => {
  console.log("fetchAllFantasyMovies: Start fetching movies");
  try {
    const movies = await fantasyMovieFirestoreStore.getAllFantasyMovies();
    console.log("fetchAllFantasyMovies: Fetched movies:", movies);
    return movies as FantasyMovieProps[];
  } catch (error) {
    console.error("fetchAllFantasyMovies: Failed to fetch fantasy movies:", error);
    throw error;
  }
};

// Component to display all fantasy movies
const AllFantasyMoviesPage: React.FC = () => {
  // Use react-query to fetch data
  const { isLoading, isError, error, data } = useQuery<FantasyMovieProps[], Error>({
    queryKey: ["allFantasyMovies"],
    queryFn: fetchAllFantasyMovies,
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Show error message if there's an error
  if (isError) {
    return <h1>{error.message}</h1>;
  }

  // Fallback to an empty array if no data is available
  const movies = data ? data : [];

  // Render the template page with the fetched movies
  return (
    <>
      <FantasyTemplateMoviePage
        title="Members Fantasy Movies"
        movies={movies}
      />
    </>
  );
};

export default AllFantasyMoviesPage;