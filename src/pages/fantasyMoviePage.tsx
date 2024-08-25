import React, { useState } from "react";
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
  const [page, setPage] = useState(1);

  const { isLoading, isError, error, data, isFetching } = useQuery<FantasyMovieProps[], Error>({
    queryKey: ["allFantasyMovies"],
    queryFn: fetchAllFantasyMovies,
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });

  console.log("AllFantasyMoviesPage: isLoading:", isLoading);
  console.log("AllFantasyMoviesPage: isError:", isError);
  console.log("AllFantasyMoviesPage: error:", error);
  console.log("AllFantasyMoviesPage: data:", data);
  console.log("AllFantasyMoviesPage: isFetching:", isFetching);

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
      <div>
        <span>Current Page: {page}</span>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous Page
        </button>
        <button
          onClick={() => {
            if (!isFetching && data && data.length && page < Math.ceil(data.length / 20)) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isFetching || (data && page >= Math.ceil(data.length / 20))}
        >
          Next Page
        </button>
        {isFetching ? <span> Loading...</span> : null}
      </div>
    </>
  );
};

export default AllFantasyMoviesPage;