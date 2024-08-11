import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import PlaylistIcon from "@mui/icons-material/PlaylistAdd";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";

const AddToPlaylistIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);

  const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.addToPlaylist(movie);

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      await userFirestoreStore.addWatchListMovie(userId, movie.id.toString()); // Add the movie to Firestore
    }

    // Add to local storage
    const storedPlaylist = JSON.parse(localStorage.getItem("playlistMovies") || "[]");
    localStorage.setItem("playlistMovies", JSON.stringify([...storedPlaylist, movie.id]));
  };

  return (
    <IconButton aria-label="add to must watch list" onClick={onUserSelect}>
      <PlaylistIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToPlaylistIcon;