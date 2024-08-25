import React, { useEffect } from "react";
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
  console.log("Current language:", language); // Log the language value

  const { data, error, isLoading, isError, refetch } = useQuery<DiscoverMovies, Error>(
    ["discover", language], 
    () => getMovies(language)
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

  const movies = data?.results ?? [];
  console.log("Movies before filtering:", movies);
  console.log("Filter values:", filterValues);

  // Log each filter value
  filterValues.forEach(filter => {
    console.log(`Filter type: ${filter.name}, Filter value: ${filter.value}`);
  });

  // Log the sort filter value specifically
  const sortFilter = filterValues.find(filter => filter.name === "sort");
  console.log("Sort filter value:", sortFilter?.value);

  // Log inside filterFunction
  const displayedMovies = filterFunction(movies);
  console.log("Displayed Movies after filtering:", displayedMovies);

  const resetFilters = () => {
    setFilterValues(createFilters());
  };

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
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        sortOption={filterValues[2].value}
        resetFilters={resetFilters}
        language={language} // had to pass in the language prop to the filter component
      />
    </>
  );
};

export default HomePage;