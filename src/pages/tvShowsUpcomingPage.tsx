import React, { useState, useEffect } from "react";
import TemplateTVShowListPage from '../components/templateTVShowListPage';
import { BaseTVShowProps, DiscoverTVShows } from "../types/interfaces";
import { fetchUpcomingTVShows } from "../api/tmdb-api";
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

const UpcomingTVPage: React.FC = () => {
  const { language } = useLanguage();
  const [page, setPage] = useState(1);

  const fetchUpcomingTVShowsWithPage = (page = 1) => {
    console.log(`Fetching upcoming TV shows for page ${page} at ${new Date().toLocaleTimeString()}`);
    return fetchUpcomingTVShows(language, page);
  };
  
  const { data, error, isLoading, isError, isFetching } = useQuery<DiscoverTVShows, Error>({
    queryKey: ["upcomingTVShows", page, language],
    queryFn: () => fetchUpcomingTVShowsWithPage(page),
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });
  
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  useEffect(() => {
    if (data) {
      console.log("Fetched upcoming TV shows data:", data);
    }
  }, [data]);
  
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
  
  const shows: BaseTVShowProps[] = data?.results || [];
  console.log("Fetched shows:", shows);

  if (shows.length === 0) {
    console.warn("No shows fetched. Check the data fetching logic.");
  }

  const displayedShows = filterFunction(shows);
  console.log("Displayed shows after filtering:", displayedShows);

  if (displayedShows.length === 0) {
    console.warn("No shows displayed after filtering. Check the filter function.");
  }

  const totalPages = data ? Math.ceil(data.total_results / 20) : 1; // Assuming 20 shows per page

  return (
    <>
      <TemplateTVShowListPage
        name="Upcoming TV Shows"
        shows={displayedShows}
        action={(show: BaseTVShowProps) => (
          <>
            <AddToFavouritesIcon type="show" media={show} />
          </>
        )}
        page={page}
        setPage={setPage}
        isFetching={isFetching}
        totalPages={totalPages}
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

export default UpcomingTVPage;