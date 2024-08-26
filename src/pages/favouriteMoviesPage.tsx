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

const createFilters = () => [
  { name: "title", value: "", condition: titleFilter, type: 'filter' as const },
  { name: "genre", value: "0", condition: genreFilterFavourites, type: 'filter' as const },
  { name: "sort", value: "name", condition: sortFilter, type: 'sort' as const },
];

const FavouriteMoviesPage: React.FC = () => {
  const { language } = useLanguage();
  const { setFavourites } = useContext(MoviesContext);
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

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

  const { data: localFavourites, isLoading: isFavouritesLoading } = useQuery(
    "favouriteMovies",
    fetchFavouriteMovies,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );

  useEffect(() => {
    if (localFavourites) {
      setFavourites(localFavourites);
    }
  }, [localFavourites, setFavourites]);

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

  const displayedMovies = useMemo(() => {
    const filteredMovies = favouriteMovies ? filterFunction(favouriteMovies) : [];
    return filteredMovies;
  }, [favouriteMovies, filterFunction]);

  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter =>
      filter.name === type ? { ...filter, value } : filter
    );
    setFilterValues(updatedFilterSet);
  };

  const resetFilters = () => {
    setFilterValues(createFilters());
  };

  if (isLoading) {
    return <Spinner />;
  }

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