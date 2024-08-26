import React, { useState, useEffect } from "react";
import PageTemplate from '../components/templateMovieListPage';
import { BaseMovieProps } from "../types/interfaces";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, genreFilter, sortFilter } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import { DiscoverMovies } from "../types/interfaces";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";
import { useLanguage } from '../contexts/languageContext';

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

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const [page, setPage] = useState(1);

  const fetchMovies = (page = 1) => {
    console.log(`Fetching movies for page ${page} at ${new Date().toLocaleTimeString()}`);
    return getMovies(language, page);
  };

  const { data, error, isLoading, isError, refetch, isFetching } = useQuery<DiscoverMovies, Error>(
    ["discover", page, language], 
    () => fetchMovies(page),
    { staleTime: 300000 } // 5 minutes cache before data is considered stale
  );

  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  useEffect(() => {
    refetch();
  }, [language, refetch]);

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

  const resetFilters = () => {
    setFilterValues(createFilters());
  };

  const movies = data?.results ?? [];
  const displayedMovies = filterFunction(movies);
  const totalPages = data ? Math.ceil(data.total_results / 20) : 1; // Assuming 20 movies per page

  return (
    <>
      <PageTemplate
        title="Discover Movies"
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => (
          <>
            <AddToPlaylistIcon {...movie} />
            <AddToFavouritesIcon type="movie" media={movie} />
          </>
        )}
        page={page}
        setPage={setPage}
        isFetching={isFetching}
        totalPages={totalPages}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        sortOption={filterValues[2].value}
        resetFilters={resetFilters}
        language={language}
      />
    </>
  );
};

export default HomePage;