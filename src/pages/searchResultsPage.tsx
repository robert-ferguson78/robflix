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

const SearchResultsPage: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';
  const searchType = location.pathname.includes('movies') ? 'movies' : 'tv';
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isFetching } = useQuery(
    ['search', searchType, query, page, language],
    () => searchType === 'movies' ? searchMovies(query, language, page) : searchTVShows(query, language, page),
    { staleTime: 300000 }
  );

  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters(searchType === 'movies'));

  useEffect(() => {
    setFilterValues(createFilters(searchType === 'movies'));
  }, [searchType, setFilterValues]);

  if (isLoading) return <Spinner />;
  if (error) return <h1>{(error as Error).message}</h1>;

  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter =>
      filter.name === type ? { ...filter, value } : filter
    );
    setFilterValues(updatedFilterSet);
  };

  const resetFilters = () => {
    setFilterValues(createFilters(searchType === 'movies'));
  };

  const results = data?.results ?? [];
  const displayedResults = filterFunction(results);
  const totalPages = data ? Math.ceil(data.total_results / 20) : 1;

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