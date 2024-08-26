import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};

const RemoveFromPlaylistIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);
  const queryClient = useQueryClient();

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

    const userId = auth.currentUser?.uid;
    if (userId) {
      console.log("User ID:", userId);
      try {
        console.log(`Removing movie with ID: ${movie.id} from user with ID: ${userId}`);
        await userFirestoreStore.removeWatchListMovie(userId, movie.id.toString());
        console.log(`Successfully removed movie with ID: ${movie.id} from Firestore`);
      } catch (error) {
        console.error(`Failed to remove movie with ID: ${movie.id} from Firestore`, error);
      }
    } else {
      console.error("User is not authenticated");
    }

    // Remove from local storage
    removeFromLocalStorage(movie.id);

    // Invalidate the playlistMovies query to trigger a refetch
    queryClient.invalidateQueries("playlistMovies");
  };

  return (
    <IconButton aria-label="remove from playlist" onClick={onUserRequest}>
      <DeleteIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromPlaylistIcon;