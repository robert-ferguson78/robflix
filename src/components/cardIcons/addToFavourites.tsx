import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import { TVShowsContext } from "../../contexts/tvShowsContext"; // Import TVShowsContext
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AddToFavouritesIconProps, BaseMovieProps, BaseTVShowProps } from "../../types/interfaces";
import { userFirestoreStore } from "../../models/user-firestore-store";
import { auth } from "../../firebase/firebaseConfig";
import { useQueryClient } from "react-query";

// Define styles for the favorite button
const styles = {
  buttonStyle: {
    color: "#ffffff",
    '&:hover': {
      color: "rgb(255, 0, 0)",
    },
  },
};

// Component for adding a movie or TV show to favorites
const AddToFavouritesIcon: React.FC<AddToFavouritesIconProps> = (props) => {
  const { type, media } = props;
  const moviesContext = useContext(MoviesContext);
  const tvShowsContext = useContext(TVShowsContext); // Use TVShowsContext
  const queryClient = useQueryClient();

  // Function to handle the user selecting the favorite button
  const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Add to favorites in the context
    if (type === "movie") {
      moviesContext.addToFavourites(media as BaseMovieProps);
    } else if (type === "show") {
      tvShowsContext.addToFavourites(media as BaseTVShowProps);
    }

    // Get the authenticated user's ID
    const userId = auth.currentUser?.uid;
    if (userId) {
      // Add the favorite to Firestore
      if (type === "movie") {
        await userFirestoreStore.addFavouriteMovie(userId, media.id.toString());
      } else if (type === "show") {
        await userFirestoreStore.addFavouriteTVShow(userId, media.id.toString());
      }
    }

    // Add to local storage and invalidate the query to trigger a refetch
    if (type === "movie") {
      const storedFavourites = JSON.parse(localStorage.getItem("favouriteMovies") || "[]");
      const updatedFavourites = [...storedFavourites, media.id];
      localStorage.setItem("favouriteMovies", JSON.stringify(updatedFavourites));
      queryClient.invalidateQueries("favouriteMovies");
    } else if (type === "show") {
      const storedFavourites = JSON.parse(localStorage.getItem("favouriteTVShows") || "[]");
      localStorage.setItem("favouriteTVShows", JSON.stringify([...storedFavourites, media.id]));
      queryClient.invalidateQueries("favouriteTVShows");
    }
  };

  // Render the favorite button
  return (
    <IconButton aria-label="add to favorites" onClick={onUserSelect}>
      <FavoriteIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default AddToFavouritesIcon;