import React, { useState, useEffect } from "react";
import TemplateTVShowListPage from '../components/templateTVShowListPage';
import { BaseTVShowProps, DiscoverTVShows } from "../types/interfaces";
import { fetchPopularTVShows } from "../api/tmdb-api";
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

const PopularTVPage: React.FC = () => {
  const { language } = useLanguage();
  const [page, setPage] = useState(1);

  const fetchPopularTVShowsWithPage = (page = 1) => {
    console.log(`Fetching popular TV shows for page ${page} at ${new Date().toLocaleTimeString()}`);
    return fetchPopularTVShows(language, page);
  };
  
  const { data, error, isLoading, isError, isFetching } = useQuery<DiscoverTVShows, Error>({
    queryKey: ["popularTVShows", page, language],
    queryFn: () => fetchPopularTVShowsWithPage(page),
    staleTime: 300000 // 5 minutes cache before data is considered stale
  });
  
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  useEffect(() => {
    if (data) {
      console.log("Fetched popular TV shows data:", data);
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

  return (
    <>
      <TemplateTVShowListPage
        name="Popular TV Shows"
        shows={displayedShows}
        action={(show: BaseTVShowProps) => (
          <>
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

export default PopularTVPage;