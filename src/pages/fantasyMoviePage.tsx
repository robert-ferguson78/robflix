import React from "react";
import FantasyTemplateMoviePage from '../components/fantasyTemplateMoviePage';
import { FantasyMovieProps } from "../types/interfaces";
import { fantasyMovieFirestoreStore } from "../models/fantasy-movie-firestore-store";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";

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

const AllFantasyMoviesPage: React.FC = () => {

  const { isLoading, isError, error, data } = useQuery<FantasyMovieProps[], Error>({
    queryKey: ["allFantasyMovies"],
    queryFn: fetchAllFantasyMovies,
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const movies = data ? data : [];

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