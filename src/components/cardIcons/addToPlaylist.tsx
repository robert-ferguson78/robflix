import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import PlaylistIcon from "@mui/icons-material/PlaylistAdd";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

// Define styles for the playlist button
const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};

// Component for adding a movie to the playlist
const AddToPlaylistIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);
  const queryClient = useQueryClient();

  // Function to handle the user selecting the playlist button
  const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Button clicked, adding to playlist:", movie);

    // Add the movie to the playlist in the context
    context.addToPlaylist(movie);

    // Get the authenticated user's ID
    const userId = auth.currentUser?.uid;
    if (userId) {
      console.log("User ID:", userId);
      try {
        // Add the movie to Firestore
        console.log(`Adding movie with ID: ${movie.id} to user with ID: ${userId}`);
        await userFirestoreStore.addWatchListMovie(userId, movie.id.toString());
        console.log(`Successfully added movie with ID: ${movie.id} to Firestore`);
      } catch (error) {
        console.error(`Failed to add movie with ID: ${movie.id} to Firestore`, error);
      }
    } else {
      console.error("User is not authenticated");
    }

    // Add the movie to local storage
    const storedPlaylist = JSON.parse(localStorage.getItem("playlistMovies") || "[]");
    localStorage.setItem("playlistMovies", JSON.stringify([...storedPlaylist, movie.id]));

    // Invalidate the playlistMovies query to trigger a refetch
    queryClient.invalidateQueries("playlistMovies");
  };

  // Render the playlist button
  return (
    <IconButton aria-label="add to must watch list" onClick={onUserSelect}>
      <PlaylistIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default AddToPlaylistIcon;