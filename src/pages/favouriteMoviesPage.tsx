import React, { useContext, useMemo, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQuery } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, sortFilter, genreFilterFavourites } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import { BaseMovieProps } from "../types/interfaces";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { userFirestoreStore } from "../models/user-firestore-store";
import { auth } from "../firebase/firebaseConfig";

const createFilters = () => [
  { name: "title", value: "", condition: titleFilter, type: 'filter' as const },
  { name: "genre", value: "0", condition: genreFilterFavourites, type: 'filter' as const },
  { name: "sort", value: "name", condition: sortFilter, type: 'sort' as const },
];

const FavouriteMoviesPage: React.FC = () => {
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
    ["favouriteMoviesDetails", localFavourites],
    async () => {
      if (!localFavourites) return [];
      const moviePromises = localFavourites.map((movieId: number) => getMovie(movieId.toString()));
      const movies = await Promise.all(moviePromises);
      console.log("Fetched movies:", movies); // Log fetched movies
      movies.forEach(movie => {
        movie.genre_ids = movie.genres.map((genre: { id: number }) => genre.id); // Ensure genre_ids is populated
        console.log(`Movie ID: ${movie.id}, Genres:`, movie.genres); // Log genres of each movie
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
    console.log("Filtering movies with filter values:", filterValues);
    const filteredMovies = favouriteMovies ? filterFunction(favouriteMovies) : [];
    console.log("Filtered movies:", filteredMovies); // Log filtered movies
    filteredMovies.forEach((movie: BaseMovieProps) => console.log(`Filtered Movie ID: ${movie.id}, Genres:`, movie.genres)); // Log genres of each filtered movie
    return filteredMovies;
  }, [favouriteMovies, filterFunction, filterValues]);

  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter =>
      filter.name === type ? { ...filter, value } : filter
    );
    console.log("Updated filter values:", updatedFilterSet);
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
      />
    </>
  );
};

export default FavouriteMoviesPage;