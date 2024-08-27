import React, { useContext, useMemo, useEffect } from "react";
import TemplateTVShowListPage from "../components/templateTVShowListPage";
import { TVShowsContext } from "../contexts/tvShowsContext";
import { useQuery } from "react-query";
import { getTVShow } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import { tvTitleFilter, tvSortFilter, tvGenreFilterFavourites } from "../filters";
import TVShowFilterUI from "../components/tvShowFilterUI";
import { BaseTVShowProps } from "../types/interfaces";
import RemoveFromFavourites from "../components/cardIcons/removeFromTVFavourites";
// import WriteReview from "../components/cardIcons/writeReview";
import { userFirestoreStore } from "../models/user-firestore-store";
import { auth } from "../firebase/firebaseConfig";
import { useLanguage } from '../contexts/languageContext';

// Function to create initial filter settings
const createFilters = () => [
  { name: "title", value: "", condition: tvTitleFilter, type: 'filter' as const },
  { name: "genre", value: "0", condition: tvGenreFilterFavourites, type: 'filter' as const },
  { name: "sort", value: "name", condition: tvSortFilter, type: 'sort' as const },
];

// Component to display the favourite TV shows page
const FavouriteTVPage: React.FC = () => {
  const { language } = useLanguage(); // Get the current language from context
  const { setFavourites } = useContext(TVShowsContext); // Get the setFavourites function from context
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters()); // Initialize filters

  // Function to fetch favourite TV shows from local storage or Firestore
  const fetchFavouriteTVShows = async (): Promise<number[]> => {
    let storedFavourites = JSON.parse(localStorage.getItem("favouriteTVShows") || "[]");

    if (storedFavourites.length === 0) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const favouriteTVShows = await userFirestoreStore.getFavouriteTVShows(userId);
        storedFavourites = favouriteTVShows.map((favTVShowId: string) => Number(favTVShowId));
        localStorage.setItem("favouriteTVShows", JSON.stringify(storedFavourites));
      }
    }

    return storedFavourites;
  };

  // Query to fetch favourite TV shows
  const { data: localFavourites, isLoading: isFavouritesLoading } = useQuery(
    "favouriteTVShows",
    fetchFavouriteTVShows,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );

  // Effect to update favourites in context when localFavourites changes
  useEffect(() => {
    if (localFavourites) {
      setFavourites(localFavourites);
    }
  }, [localFavourites, setFavourites]);

  // Effect to handle storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedFavourites = JSON.parse(localStorage.getItem("favouriteTVShows") || "[]");
      setFavourites(updatedFavourites);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setFavourites]);

  // Query to fetch details of favourite TV shows
  const { data: favouriteTVShows, isLoading: isTVShowsLoading } = useQuery(
    ["favouriteTVShowsDetails", localFavourites, language],
    async () => {
      if (!localFavourites) return [];
      const tvShowPromises = localFavourites.map((tvShowId: number) => getTVShow(tvShowId.toString(), language));
      const tvShows = await Promise.all(tvShowPromises);
      console.log("Fetched TV shows:", tvShows); // Log fetched TV shows
      tvShows.forEach(tvShow => {
        tvShow.genre_ids = tvShow.genres.map((genre: { id: number }) => genre.id); // Ensure genre_ids is populated
        console.log(`TV Show ID: ${tvShow.id}, Genres:`, tvShow.genres); // Log genres of each TV show
      });
      console.log("Final TV shows structure:", tvShows);
      return tvShows;
    },
    {
      enabled: !!localFavourites,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );

  const isLoading = isFavouritesLoading || isTVShowsLoading;

  // Memoize the filtered TV shows
  const displayedTVShows = useMemo(() => {
    console.log("Filtering TV shows with filter values:", filterValues);
    const filteredTVShows = favouriteTVShows ? filterFunction(favouriteTVShows) : [];
    console.log("Filtered TV shows:", filteredTVShows); // Log filtered TV shows
    filteredTVShows.forEach((tvShow: BaseTVShowProps) => console.log(`Filtered TV Show ID: ${tvShow.id}, Genres:`, tvShow.genres)); // Log genres of each filtered TV show
    return filteredTVShows;
  }, [favouriteTVShows, filterFunction, filterValues]);

  // Function to change filter values
  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter =>
      filter.name === type ? { ...filter, value } : filter
    );
    console.log("Updated filter values:", updatedFilterSet);
    setFilterValues(updatedFilterSet);
  };

  // Function to reset filters to initial values
  const resetFilters = () => {
    setFilterValues(createFilters());
  };

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Render the page template with the filtered TV shows and filter UI
  return (
    <>
      <TemplateTVShowListPage
        name="Favourite TV Shows"
        shows={displayedTVShows}
        action={(tvShow) => (
          <>
            <RemoveFromFavourites {...tvShow} />
            {/* <WriteReview {...tvShow} /> */}
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

export default FavouriteTVPage;