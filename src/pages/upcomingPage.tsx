import React, { useState } from "react";
import PageTemplate from '../components/templateMovieListPage';
import { BaseMovieProps } from "../types/interfaces";
import { upcomingMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import { DiscoverMovies } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query"; // updated import
import Spinner from "../components/spinner";
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";
// import { filterUpcomingMovies } from "../util";

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

const UpcomingMoviesPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const fetchUpcomingMovies = (page = 1) => {
    console.log(`Fetching upcoming movies for page ${page} at ${new Date().toLocaleTimeString()}`);
    return upcomingMovies(page);
  };

  const { isLoading, isError, error, data, isFetching } = useQuery<DiscoverMovies, Error>({
    queryKey: ["upcoming", page],
    queryFn: () => fetchUpcomingMovies(page),
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });

  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

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

  const movies = data ? data.results : [];
  // const upcomingMoviesFiltered = filterUpcomingMovies(movies);
  const displayedMovies = filterFunction(movies);

  return (
    <>
      <PageTemplate
        title="Upcoming Movies"
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => {
          return <AddToPlaylistIcon {...movie} />
        }}
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
            if (!isFetching && data?.total_pages && page < data.total_pages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isFetching || (data && page >= data.total_pages)}
        >
          Next Page
        </button>
        {isFetching ? <span> Loading...</span> : null}
      </div>
    </>
  );
};

export default UpcomingMoviesPage;