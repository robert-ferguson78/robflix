import React, { useContext, useMemo, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQuery } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, sortFilter, genreFilterFavourites } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { userFirestoreStore } from "../models/user-firestore-store";
import { auth } from "../firebase/firebaseConfig";
import { useLanguage } from '../contexts/languageContext';

// Function to create initial filter settings
const createFilters = () => [
  { name: "title", value: "", condition: titleFilter, type: 'filter' as const },
  { name: "genre", value: "0", condition: genreFilterFavourites, type: 'filter' as const },
  { name: "sort", value: "name", condition: sortFilter, type: 'sort' as const },
];

// Component to display the favourite movies page
const FavouriteMoviesPage: React.FC = () => {
  const { language } = useLanguage(); // Get the current language from context
  const { setFavourites } = useContext(MoviesContext); // Get the setFavourites function from context
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters()); // Initialize filters

  // Function to fetch favourite movies from local storage or Firestore
  const fetchFavouriteMovies = async (): Promise<number[]> => {
    let storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");

    if (storedFavourites.length === 0) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const favouriteMovies = await userFirestoreStore.getFavouriteMovies(userId);
        storedFavourites = favouriteMovies.map((favMovieId: string) => Number(favMovieId));
        localStorage.setItem("favouriteMovies", JSON.stringify(storedFavourites));
      }
    }

    return storedFavourites;
  };

  // Query to fetch favourite movies
  const { data: localFavourites, isLoading: isFavouritesLoading } = useQuery(
    "favouriteMovies",
    fetchFavouriteMovies,
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
      const updatedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
      setFavourites(updatedFavourites);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setFavourites]);

  // Query to fetch details of favourite movies
  const { data: favouriteMovies, isLoading: isMoviesLoading } = useQuery(
    ["favouriteMoviesDetails", localFavourites, language],
    async () => {
      if (!localFavourites) return [];
      const moviePromises = localFavourites.map((movieId: number) => getMovie(movieId.toString(), language));
      const movies = await Promise.all(moviePromises);
      movies.forEach(movie => {
        movie.genre_ids = movie.genres.map((genre: { id: number }) => genre.id);
      });
      return movies;
    },
    {
      enabled: !!localFavourites,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );

  const isLoading = isFavouritesLoading || isMoviesLoading;

  // Memoize the filtered movies
  const displayedMovies = useMemo(() => {
    const filteredMovies = favouriteMovies ? filterFunction(favouriteMovies) : [];
    return filteredMovies;
  }, [favouriteMovies, filterFunction]);

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

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Render the page template with the filtered movies and filter UI
  return (
    <>
      <PageTemplate
        title="Favourite Movies"
        movies={displayedMovies}
        action={(movie) => (
          <>
            <RemoveFromFavourites {...movie} />
            <WriteReview {...movie} />
          </>
        )}
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

export default FavouriteMoviesPage;