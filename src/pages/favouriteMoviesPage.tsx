import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, sortFilter, genreFilterFavourites } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { userFirestoreStore } from "../models/user-firestore-store";
import { auth } from "../firebase/firebaseConfig";

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
    condition: genreFilterFavourites,
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

const FavouriteMoviesPage: React.FC = () => {
  useContext(MoviesContext);
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  const [localFavourites, setLocalFavourites] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavouriteMovies = async () => {
      let storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");

      if (storedFavourites.length === 0) {
        const userId = auth.currentUser?.uid;
        if (userId) {
          // Fetch the favourite movies from Firestore
          const favouriteMovies = await userFirestoreStore.getFavouriteMovies(userId);
          storedFavourites = favouriteMovies.map((favMovieId: string) => Number(favMovieId));
          localStorage.setItem("favouriteMovies", JSON.stringify(storedFavourites));
        }
      }

      setLocalFavourites(storedFavourites);
    };

    fetchFavouriteMovies();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
      setLocalFavourites(storedFavourites);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const favouriteMovieQueries = useQueries(
    localFavourites.map((movieId) => {
      return {
        queryKey: ["movie", movieId],
        queryFn: async () => {
          const movie = await getMovie(movieId.toString());
          // console.log(`Fetched movie data for ID ${movieId}:`, movie);
          return movie;
        },
      };
    })
  );

  const isLoading = favouriteMovieQueries.find((m) => m.isLoading === true);

  if (isLoading) {
    return <Spinner />;
  }

  const allFavourites = favouriteMovieQueries.map((q) => q.data);
  // console.log("All favourite movies before filtering:", allFavourites);

  // Log the genre filter value
  // const genreFilterValue = filterValues.find(filter => filter.name === "genre")?.value;
  // console.log("Genre filter value:", genreFilterValue);

  // Log the entire movie object to check why genre_ids is undefined
  // allFavourites.forEach((movie, index) => {
  //   console.log(`Movie ${index}:`, movie);
  // });

  const displayedMovies = allFavourites ? filterFunction(allFavourites) : [];

  // Log the result of the genre filter condition for each movie
  // if (genreFilterValue) {
  //   allFavourites.forEach((movie, index) => {
  //     const result = genreFilterFavourites(movie, genreFilterValue);
  //     console.log(`Genre filter result for movie ${index}:`, result);
  //   });
  // }

  // console.log("Displayed movies after filtering:", displayedMovies);

  const changeFilterValues = (type: string, value: string) => {
    const updatedFilterSet = filterValues.map(filter => 
      filter.name === type ? { ...filter, value } : filter
    );
    // console.log(`Updated filter values for ${type}:`, updatedFilterSet);
    setFilterValues(updatedFilterSet);
  };

  const resetFilters = () => {
    setFilterValues(createFilters());
  };

  return (
    <>
      <PageTemplate
        title="Favourite Movies"
        movies={displayedMovies}
        action={(movie) => {
          return (
            <>
              <RemoveFromFavourites {...movie} />
              <WriteReview {...movie} />
            </>
          );
        }}
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