import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";

const RemoveFromPlaylistIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);

  const removeFromLocalStorage = (movieId: number) => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlistMovies") || "[]");
    const updatedPlaylist = storedPlaylist.filter((id: number) => id !== movieId);
    localStorage.setItem("playlistMovies", JSON.stringify(updatedPlaylist));

    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  const onUserRequest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Button clicked, removing from playlist:", movie);

    context.removeFromPlaylist(movie);

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      console.log("User ID:", userId);
      await userFirestoreStore.removeWatchListMovie(userId, movie.id.toString()); // Remove the movie from Firestore
    } else {
      console.error("User is not authenticated");
    }

    // Remove from local storage
    removeFromLocalStorage(movie.id);
  };

  return (
    <IconButton aria-label="remove from playlist" onClick={onUserRequest}>
      <DeleteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromPlaylistIcon;