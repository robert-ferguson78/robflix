import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

const RemoveFromFavouritesIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);
  const queryClient = useQueryClient();

  const removeFromLocalStorage = (movieId: number) => {
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
    const updatedFavourites = storedFavourites.filter((id: number) => id !== movieId);
    localStorage.setItem("favouriteMovies", JSON.stringify(updatedFavourites));

    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  const onUserRequest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.removeFromFavourites(movie);

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      await userFirestoreStore.removeFavouriteMovie(userId, movie.id.toString()); // Remove the movie from Firestore
    }

    // Remove from local storage
    removeFromLocalStorage(movie.id);

    // Invalidate the favouriteMovies query to trigger a refetch
    queryClient.invalidateQueries("favouriteMovies");
  };

  return (
    <IconButton aria-label="remove from favorites" onClick={onUserRequest}>
      <DeleteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromFavouritesIcon;