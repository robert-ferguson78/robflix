import React, { useContext, useMemo, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQuery, useQueryClient } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import { titleFilter, sortFilter, genreFilterFavourites } from "../filters";
import MovieFilterUI from "../components/movieFilterUI";
import { BaseMovieProps } from "../types/interfaces";
import RemoveFromPlaylistIcon from "../components/cardIcons/removeFromPlaylist"; // Correct import
import WriteReview from "../components/cardIcons/writeReview";
import { userFirestoreStore } from "../models/user-firestore-store";
import { auth } from "../firebase/firebaseConfig";

const createFilters = () => [
  { name: "title", value: "", condition: titleFilter, type: 'filter' as const },
  { name: "genre", value: "0", condition: genreFilterFavourites, type: 'filter' as const },
  { name: "sort", value: "name", condition: sortFilter, type: 'sort' as const },
];

const PlaylistMoviesPage: React.FC = () => {
  const { mustPlaylist, setMustPlaylist } = useContext(MoviesContext);
  const queryClient = useQueryClient();
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters());

  const fetchPlaylistMovies = async (): Promise<number[]> => {
    let storedPlaylists = JSON.parse(localStorage.getItem("playlistMovies") || "[]");

    if (storedPlaylists.length === 0) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const playlistMovies = await userFirestoreStore.getWatchListMovies(userId);
        storedPlaylists = playlistMovies.map((favMovieId: string) => Number(favMovieId));
        localStorage.setItem("playlistMovies", JSON.stringify(storedPlaylists));
      }
    }

    return storedPlaylists;
  };

  const { data: localPlaylist, isLoading: isPlaylistLoading } = useQuery(
    "playlistMovies",
    fetchPlaylistMovies,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      onSuccess: (data) => {
        setMustPlaylist(data);
      },
    }
  );

  const { data: playlistMovies, isLoading: isMoviesLoading } = useQuery(
    ["playlistMoviesDetails", mustPlaylist],
    async () => {
      if (!mustPlaylist || mustPlaylist.length === 0) return [];
      const moviePromises = mustPlaylist.map((movieId: number) => getMovie(movieId.toString()));
      const movies = await Promise.all(moviePromises);
      console.log("Fetched movies:", movies); // Log fetched movies
      movies.forEach(movie => {
        movie.genre_ids = movie.genres.map((genre: { id: number }) => genre.id); // Ensure genre_ids is populated
        console.log(`Movie ID: ${movie.id}, Genres:`, movie.genres); // Log genres of each movie
      });
      return movies;
    },
    {
      enabled: !!mustPlaylist && mustPlaylist.length > 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );

  const isLoading = isPlaylistLoading || isMoviesLoading;

  const displayedMovies = useMemo(() => {
    console.log("Filtering movies with filter values:", filterValues);
    const filteredMovies = playlistMovies ? filterFunction(playlistMovies) : [];
    console.log("Filtered movies:", filteredMovies); // Log filtered movies
    filteredMovies.forEach((movie: BaseMovieProps) => console.log(`Filtered Movie ID: ${movie.id}, Genres:`, movie.genres)); // Log genres of each filtered movie
    return filteredMovies;
  }, [playlistMovies, filterFunction, filterValues]);

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

  useEffect(() => {
    if (localPlaylist && localPlaylist.length > 0) {
      setMustPlaylist(localPlaylist);
      queryClient.invalidateQueries("playlistMoviesDetails");
    }
  }, [localPlaylist, setMustPlaylist, queryClient]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <PageTemplate
        title="Must Watch Movies"
        movies={displayedMovies}
        action={(movie) => (
          <>
            <RemoveFromPlaylistIcon {...movie} />
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

export default PlaylistMoviesPage;