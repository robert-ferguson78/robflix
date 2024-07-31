import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { userFirestoreStore } from "../models/user-firestore-store";
import { auth } from "../firebase/firebaseConfig";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

const FavouriteMoviesPage: React.FC = () => {
  useContext(MoviesContext);
  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

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
        queryFn: () => getMovie(movieId.toString()),
      };
    })
  );

  const isLoading = favouriteMovieQueries.find((m) => m.isLoading === true);

  if (isLoading) {
    return <Spinner />;
  }

  const allFavourites = favouriteMovieQueries.map((q) => q.data);
  const displayedMovies = allFavourites ? filterFunction(allFavourites) : [];

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title" ? [changedFilter, filterValues[1]] : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
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
      />
    </>
  );
};

export default FavouriteMoviesPage;