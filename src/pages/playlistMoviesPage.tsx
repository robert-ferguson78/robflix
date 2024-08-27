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
import RemoveFromPlaylistIcon from "../components/cardIcons/removeFromPlaylist";
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

// Component to display the playlist movies page
const PlaylistMoviesPage: React.FC = () => {
  const { language } = useLanguage(); // Get the current language from context
  const { mustPlaylist, setMustPlaylist } = useContext(MoviesContext); // Get the must-watch playlist from context
  const queryClient = useQueryClient(); // Get the query client for react-query
  const { filterValues, setFilterValues, filterFunction } = useFiltering(createFilters()); // Initialize filters

  // Function to fetch playlist movies from local storage or Firestore
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

  // Query to fetch playlist movies
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

  // Query to fetch details of playlist movies
  const { data: playlistMovies, isLoading: isMoviesLoading } = useQuery(
    ["playlistMoviesDetails", mustPlaylist, language],
    async () => {
      if (!mustPlaylist || mustPlaylist.length === 0) return [];
      const moviePromises = mustPlaylist.map((movieId: number) => getMovie(movieId.toString(), language));
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

  // Memoize the filtered movies
  const displayedMovies = useMemo(() => {
    console.log("Filtering movies with filter values:", filterValues);
    const filteredMovies = playlistMovies ? filterFunction(playlistMovies) : [];
    console.log("Filtered movies:", filteredMovies); // Log filtered movies
    filteredMovies.forEach((movie: BaseMovieProps) => console.log(`Filtered Movie ID: ${movie.id}, Genres:`, movie.genres)); // Log genres of each filtered movie
    return filteredMovies;
  }, [playlistMovies, filterFunction, filterValues]);

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

  // Effect to update must-watch playlist when localPlaylist changes
  useEffect(() => {
    if (localPlaylist && localPlaylist.length > 0) {
      setMustPlaylist(localPlaylist);
      queryClient.invalidateQueries("playlistMoviesDetails");
    }
  }, [localPlaylist, setMustPlaylist, queryClient]);

  // Effect to refetch playlist movie details when language or mustPlaylist changes
  useEffect(() => {
    queryClient.invalidateQueries(["playlistMoviesDetails", mustPlaylist, language]);
  }, [language, mustPlaylist, queryClient]);

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Render the page template with the filtered movies and filter UI
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
        language={language}
      />
    </>
  );
};

export default PlaylistMoviesPage;