import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import PlaylistIcon from "@mui/icons-material/PlaylistAdd";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

const AddToPlaylistIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);
  const queryClient = useQueryClient();

  const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Button clicked, adding to playlist:", movie);

    context.addToPlaylist(movie);

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      console.log("User ID:", userId);
      try {
        console.log(`Adding movie with ID: ${movie.id} to user with ID: ${userId}`);
        await userFirestoreStore.addWatchListMovie(userId, movie.id.toString()); // Add the movie to Firestore
        console.log(`Successfully added movie with ID: ${movie.id} to Firestore`);
      } catch (error) {
        console.error(`Failed to add movie with ID: ${movie.id} to Firestore`, error);
      }
    } else {
      console.error("User is not authenticated");
    }

    // Add to local storage
    const storedPlaylist = JSON.parse(localStorage.getItem("playlistMovies") || "[]");
    localStorage.setItem("playlistMovies", JSON.stringify([...storedPlaylist, movie.id]));

    // Invalidate the playlistMovies query to trigger a refetch
    queryClient.invalidateQueries("playlistMovies");
  };

  return (
    <IconButton aria-label="add to must watch list" onClick={onUserSelect}>
      <PlaylistIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToPlaylistIcon;