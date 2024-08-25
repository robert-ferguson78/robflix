import React, { useEffect } from "react";
import TemplateTVShowListPage from '../components/templateTVShowListPage';
import { BaseTVShowProps, DiscoverTVShows } from "../types/interfaces";
import { getTVShows } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { tvTitleFilter, tvGenreFilter, tvSortFilter } from "../filters";
import TVShowFilterUI from "../components/tvShowFilterUI";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
import { useLanguage } from '../contexts/languageContext';

const createFilters = () => {
  const titleFiltering = {
    name: "title",
    value: "",
    condition: tvTitleFilter,
    type: 'filter' as const,
  };

  const genreFiltering = {
    name: "genre",
    value: "0",
    condition: tvGenreFilter,
    type: 'filter' as const,
  };

  const sortFiltering = {
    name: "sort",
    value: "name", // Set a default sort value
    condition: tvSortFilter,
    type: 'sort' as const,
  };

  return [titleFiltering, genreFiltering, sortFiltering];
};

const TVShowsPage: React.FC = () => {
  const { language } = useLanguage();
  console.log("Current language:", language); // Log the language value

  const { data, error, isLoading, isError, refetch } = useQuery<DiscoverTVShows, Error>(
    ["discoverTVShows", language], 
    () => getTVShows(language)
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

  const shows: BaseTVShowProps[] = data?.results ?? [];
  console.log("TV Shows before filtering:", shows);
  console.log("Filter values:", filterValues);

  // Log each filter value
  filterValues.forEach(filter => {
    console.log(`Filter type: ${filter.name}, Filter value: ${filter.value}`);
  });

  // Log the sort filter value specifically
  const sortFilter = filterValues.find(filter => filter.name === "sort");
  console.log("Sort filter value:", sortFilter?.value);

  // Log inside filterFunction
  const displayedShows = filterFunction(shows);
  console.log("Displayed TV Shows after filtering:", displayedShows);

  const resetFilters = () => {
    setFilterValues(createFilters());
  };

  return (
    <>
      <TemplateTVShowListPage
        name="Discover TV Shows"
        shows={displayedShows}
        action={(show: BaseTVShowProps) => (
          <>
            {/* <AddToPlaylistIcon {...show} /> */}
            <AddToFavouritesIcon type="show" media={show} />
          </>
        )}
      />
      <TVShowFilterUI
        onUserInput={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        sortOption={filterValues[2].value}
        resetFilters={resetFilters}
        language={language}
      />
    </>
  );
};

export default TVShowsPage;