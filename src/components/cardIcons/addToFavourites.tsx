import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import { TVShowsContext } from "../../contexts/tvShowsContext"; // Import TVShowsContext
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AddToFavouritesIconProps, BaseMovieProps, BaseTVShowProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";

const AddToFavouritesIcon: React.FC<AddToFavouritesIconProps> = (props) => {
  const { type, media } = props;
  const moviesContext = useContext(MoviesContext);
  const tvShowsContext = useContext(TVShowsContext); // Use TVShowsContext

  const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (type === "movie") {
      moviesContext.addToFavourites(media as BaseMovieProps);
    } else if (type === "show") {
      tvShowsContext.addToFavourites(media as BaseTVShowProps);
    }

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      if (type === "movie") {
        await userFirestoreStore.addFavouriteMovie(userId, media.id.toString()); // Add the movie to Firestore
      } else if (type === "show") {
        await userFirestoreStore.addFavouriteTVShow(userId, media.id.toString()); // Add the TV show to Firestore
      }
    }

    // Add to local storage
    if (type === "movie") {
      const storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
      localStorage.setItem("favouriteMovies", JSON.stringify([...storedFavourites, media.id]));
    } else if (type === "show") {
      const storedFavourites = JSON.parse(localStorage.getItem("favouriteTVShows") || "[]");
      localStorage.setItem("favouriteTVShows", JSON.stringify([...storedFavourites, media.id]));
    }
  };

  return (
    <IconButton aria-label="add to favorites" onClick={onUserSelect}>
      <FavoriteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToFavouritesIcon;