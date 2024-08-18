import React, { useEffect, useState } from "react";
import TemplateTVShowListPage from '../components/templateTVShowListPage';
import { BaseTVShowProps, Genre, DiscoverTVShows } from "../types/interfaces";
import { getTVShows, getTVGenres } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import { tvTitleFilter, tvGenreFilter, tvSortFilter } from "../filters";
import TVShowFilterUI from "../components/tvShowFilterUI";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from '../components/cardIcons/addToFavourites';
// import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";

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
    condition: (show: BaseTVShowProps, value: string) => tvGenreFilter(show, value),
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
  const { data, error, isLoading, isError } = useQuery<DiscoverTVShows, Error>("discoverTVShows", getTVShows);
  const setGenres = useState<Genre[]>([])[1];
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  useEffect(() => {
    const fetchGenres = async () => {
      const genres = await getTVGenres();
      console.log("Fetched TV show genres data page:", genres);
      setGenres(genres);
    };
    fetchGenres();
  }, []);

  if (isLoading) {
    console.log("Loading data...");
    return <Spinner />;
  }

  if (isError) {
    console.error("Error fetching data:", error);
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
      />
    </>
  );
};

export default TVShowsPage;