import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

// Define styles for the button
const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};

// Define the RemoveFromPlaylistIcon component
const RemoveFromPlaylistIcon: React.FC<BaseMovieProps> = (movie) => {
  // Access the MoviesContext
  const context = useContext(MoviesContext);
  // Initialize the query client
  const queryClient = useQueryClient();

  // Function to remove a movie from local storage
  const removeFromLocalStorage = (movieId: number) => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlistMovies") || "[]");
    const updatedPlaylist = storedPlaylist.filter((id: number) => id !== movieId);
    localStorage.setItem("playlistMovies", JSON.stringify(updatedPlaylist));

    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  // Event handler for removing a movie from the playlist
  const onUserRequest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Button clicked, removing from playlist:", movie);

    // Remove the movie from the context
    context.removeFromPlaylist(movie);

    // Get the current user ID
    const userId = auth.currentUser?.uid;
    if (userId) {
      console.log("User ID:", userId);
      try {
        console.log(`Removing movie with ID: ${movie.id} from user with ID: ${userId}`);
        // Remove the movie from Firestore
        await userFirestoreStore.removeWatchListMovie(userId, movie.id.toString());
        console.log(`Successfully removed movie with ID: ${movie.id} from Firestore`);
      } catch (error) {
        console.error(`Failed to remove movie with ID: ${movie.id} from Firestore`, error);
      }
    } else {
      console.error("User is not authenticated");
    }

    // Remove the movie from local storage
    removeFromLocalStorage(movie.id);

    // Invalidate the playlistMovies query to trigger a refetch
    queryClient.invalidateQueries("playlistMovies");
  };

  // Render the IconButton with the DeleteIcon
  return (
    <IconButton aria-label="remove from playlist" onClick={onUserRequest}>
      <DeleteIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromPlaylistIcon;