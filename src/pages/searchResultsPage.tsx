import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import PageTemplate from '../components/templateMovieListPage';
import TemplateTVShowListPage from '../components/templateTVShowListPage';
import { BaseMovieProps, BaseTVShowProps } from "../types/interfaces";
import { searchMovies, searchTVShows } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, genreFilter, sortFilter, tvTitleFilter, tvGenreFilter, tvSortFilter } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import TVShowFilterUI from "../components/tvShowFilterUI";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";
import { useLanguage } from '../contexts/languageContext';

// Function to create initial filter settings based on whether it's a movie or TV show
const createFilters = (isMovie: boolean) => {
  const titleFiltering = {
    name: "title",
    value: "",
    condition: isMovie ? titleFilter : tvTitleFilter,
    type: 'filter' as const,
  };

  const genreFiltering = {
    name: "genre",
    value: "0",
    condition: isMovie ? genreFilter : tvGenreFilter,
    type: 'filter' as const,
  };

  const sortFiltering = {
    name: "sort",
    value: "name",
    condition: isMovie ? sortFilter : tvSortFilter,
    type: 'sort' as const,
  };

  return [titleFiltering, genreFiltering, sortFiltering];
};

// Component to display search results for movies or TV shows
const SearchResultsPage: React.FC = () => {
  const { language } = useLanguage(); // Get the current language from context
  const location = useLocation(); // Get the current location
  const searchParams = new URLSearchParams(location.search); // Parse the search parameters
  const query = searchParams.get('query') || ''; // Get the search query
  const searchType = location.pathname.includes('movies') ? 'movies' : 'tv'; // Determine if the search is for movies or TV shows
  const [page, setPage] = useState(1); // State to manage the current page

  // Query to fetch search results based on the search type, query, page, and language
  const { data, isLoading, error, isFetching } = useQuery(
    ['search', searchType, query, page, language],
    () => searchType === 'movies' ? searchMovies(query, language, page) : searchTVShows(query, language, page),
    { staleTime: 300000 } // 5 minutes cache before data is considered stale
  );

  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters(searchType === 'movies')); // Initialize filters

  // Effect to reset filters when the search type changes
  useEffect(() => {
    setFilterValues(createFilters(searchType === 'movies'));
  }, [searchType, setFilterValues]);

  // Show spinner while loading
  if (isLoading) return <Spinner />;
  // Show error message if there's an error
  if (error) return <h1>{(error as Error).message}</h1>;

  // Function to change filter values
  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter =>
      filter.name === type ? { ...filter, value } : filter
    );
    setFilterValues(updatedFilterSet);
  };

  // Function to reset filters to initial values
  const resetFilters = () => {
    setFilterValues(createFilters(searchType === 'movies'));
  };

  const results = data?.results ?? []; // Get the search results from the query data
  const displayedResults = filterFunction(results); // Apply filters to the search results
  const totalPages = data ? Math.ceil(data.total_results / 20) : 1; // Calculate total pages assuming 20 results per page

  // Render the page template with the filtered results and filter UI
  return (
    <>
      {searchType === 'movies' ? (
        <PageTemplate
          title={`Search Results for "${query}" - Movies`}
          movies={displayedResults as BaseMovieProps[]}
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
      ) : (
        <TemplateTVShowListPage
          name={`Search Results for "${query}" - TV Shows`}
          shows={displayedResults as BaseTVShowProps[]}
          action={(show: BaseTVShowProps) => (
            <AddToFavouritesIcon type="show" media={show} />
          )}
          page={page}
          setPage={setPage}
          isFetching={isFetching}
          totalPages={totalPages}
        />
      )}
      {searchType === 'movies' ? (
        <MovieFilterUI
          onFilterValuesChange={changeFilterValues}
          titleFilter={filterValues[0].value}
          genreFilter={filterValues[1].value}
          sortOption={filterValues[2].value}
          resetFilters={resetFilters}
          language={language}
        />
      ) : (
        <TVShowFilterUI
          onUserInput={changeFilterValues}
          titleFilter={filterValues[0].value}
          genreFilter={filterValues[1].value}
          sortOption={filterValues[2].value}
          resetFilters={resetFilters}
          language={language}
        />
      )}
    </>
  );
};

export default SearchResultsPage;