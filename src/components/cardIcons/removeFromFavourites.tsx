import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

// Define styles for the remove button
const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};

// Component for removing a movie from the favourites
const RemoveFromFavouritesIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);
  const queryClient = useQueryClient();

  // Function to remove a movie from local storage
  const removeFromLocalStorage = (movieId: number) => {
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
    const updatedFavourites = storedFavourites.filter((id: number) => id !== movieId);
    localStorage.setItem("favouriteMovies", JSON.stringify(updatedFavourites));

    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  // Function to handle the user request to remove a movie from the favourites
  const onUserRequest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.removeFromFavourites(movie);

    // Get the authenticated user's ID
    const userId = auth.currentUser?.uid;
    if (userId) {
      await userFirestoreStore.removeFavouriteMovie(userId, movie.id.toString()); // Remove the movie from Firestore
    }

    // Remove the movie from local storage
    removeFromLocalStorage(movie.id);

    // Invalidate the favouriteMovies query to trigger a refetch
    queryClient.invalidateQueries("favouriteMovies");
  };

  // Render the remove button
  return (
    <IconButton aria-label="remove from favorites" onClick={onUserRequest}>
      <DeleteIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromFavouritesIcon;