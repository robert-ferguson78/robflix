import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { BaseMovieProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";

const AddToFavouritesIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);

  const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.addToFavourites(movie);

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      await userFirestoreStore.addFavouriteMovie(userId, movie.id.toString()); // Add the movie to Firestore
    }

    // Add to local storage
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
    localStorage.setItem("favouriteMovies", JSON.stringify([...storedFavourites, movie.id]));
  };

  return (
    <IconButton aria-label="add to favorites" onClick={onUserSelect}>
      <FavoriteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToFavouritesIcon;