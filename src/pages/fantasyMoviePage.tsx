import React, { useState } from "react";
import FantasyTemplateMoviePage from '../components/fantasyTemplateMoviePage';
import { FantasyMovieProps } from "../types/interfaces";
import { fantasyMovieFirestoreStore } from "../models/fantasy-movie-firestore-store";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};

const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

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

  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

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

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title"
        ? [changedFilter, filterValues[1]]
        : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  const movies = data ? data : [];
  const displayedMovies = filterFunction(movies);

  return (
    <>
      <FantasyTemplateMoviePage
        title="Members Fantasy Movies"
        movies={displayedMovies}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
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