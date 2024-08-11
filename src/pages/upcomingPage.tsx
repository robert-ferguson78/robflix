import React, { useState } from "react";
import PageTemplate from '../components/templateMovieListPage';
import { BaseMovieProps } from "../types/interfaces";
import { upcomingMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, genreFilter, sortFilter } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import { DiscoverMovies } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query"; // updated import
import Spinner from "../components/spinner";
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';

const createFilters = () => {
  const titleFiltering = {
    name: "title",
    value: "",
    condition: titleFilter,
    type: 'filter' as const,
  };

  const genreFiltering = {
    name: "genre",
    value: "0",
    condition: genreFilter,
    type: 'filter' as const,
  };

  const sortFiltering = {
    name: "sort",
    value: "name", // Set a default sort value
    condition: sortFilter,
    type: 'sort' as const,
  };

  return [titleFiltering, genreFiltering, sortFiltering];
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

  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter => 
      filter.name === type ? { ...filter, value } : filter
    );
    setFilterValues(updatedFilterSet);
  };

  const movies = data ? data.results : [];
  const displayedMovies = filterFunction(movies);

  return (
    <>
      <PageTemplate
        title="Upcoming Movies"
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => (
          <>
            <AddToPlaylistIcon {...movie} />
            <AddToFavouritesIcon {...movie} />
          </>
        )}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        sortOption={filterValues[2].value}
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