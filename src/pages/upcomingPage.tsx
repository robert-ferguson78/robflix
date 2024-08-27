import React, { useState } from "react";
import PageTemplate from '../components/templateMovieListPage';
import { BaseMovieProps } from "../types/interfaces";
import { upcomingMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, genreFilter, sortFilter } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import { DiscoverMovies } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
import { useLanguage } from '../contexts/languageContext';

// Function to create initial filter settings for movies
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

// Component to display the upcoming movies page
const UpcomingMoviesPage: React.FC = () => {
  const { language } = useLanguage(); // Get the current language from context
  const [page, setPage] = useState(1); // State to manage the current page

  // Function to fetch upcoming movies based on the current page and language
  const fetchUpcomingMovies = (page = 1) => {
    console.log(`Fetching upcoming movies for page ${page} at ${new Date().toLocaleTimeString()}`);
    return upcomingMovies(language, page);
  };

  // Query to fetch upcoming movies using react-query
  const { isLoading, isError, error, data, isFetching } = useQuery<DiscoverMovies, Error>({
    queryKey: ["upcoming", page, language],
    queryFn: () => fetchUpcomingMovies(page),
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });

  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters()); // Initialize filters

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Show error message if there's an error
  if (isError) {
    return <h1>{error.message}</h1>;
  }

  // Function to change filter values
  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter => 
      filter.name === type ? { ...filter, value } : filter
    );
    setFilterValues(updatedFilterSet);
  };

  // Function to reset filters to initial values
  const resetFilters = () => {
    setFilterValues(createFilters());
  };

  const movies = data ? data.results : []; // Get the movies from the query data
  const displayedMovies = filterFunction(movies); // Apply filters to the movies

  const totalPages = data ? Math.ceil(data.total_results / 20) : 1; // Calculate total pages assuming 20 movies per page

  // Render the page template with the filtered movies and filter UI
  return (
    <>
      <PageTemplate
        title="Upcoming Movies"
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

export default UpcomingMoviesPage;