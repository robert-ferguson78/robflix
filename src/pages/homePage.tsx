import React from "react";
import PageTemplate from '../components/templateMovieListPage';
import { BaseMovieProps } from "../types/interfaces";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, genreFilter, sortFilter } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import { DiscoverMovies, MovieFilterUIProps } from "../types/interfaces";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
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

const HomePage: React.FC = () => {
  const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>("discover", getMovies);
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

  return (
    <>
      <PageTemplate
        title="Discover Movies"
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => <AddToFavouritesIcon {...movie} />}
      />
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        sortOption={filterValues[2].value}
      />
    </>
  );
};

export default HomePage;