import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TVShowsContext } from "../../contexts/tvShowsContext";
import { BaseTVShowProps } from "../../types/interfaces";
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

// Define the RemoveFromFavouritesIcon component
const RemoveFromFavouritesIcon: React.FC<BaseTVShowProps> = (show) => {
  // Access the TVShowsContext
  const context = useContext(TVShowsContext);
  // Initialize the query client
  const queryClient = useQueryClient();

  // Function to remove a TV show from local storage
  const removeFromLocalStorage = (showId: number) => {
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteTVShows") || "[]");
    const updatedFavourites = storedFavourites.filter((id: number) => id !== showId);
    localStorage.setItem("favouriteTVShows", JSON.stringify(updatedFavourites));

    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  // Event handler for removing a TV show from the favourites
  const onUserRequest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Remove the show from the context
    context.removeFromFavourites(show);

    // Get the current user ID
    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      // Remove the show from Firestore
      await userFirestoreStore.removeFavouriteTVShow(userId, show.id.toString());
    }

    // Remove the show from local storage
    removeFromLocalStorage(show.id);

    // Invalidate the favouriteTVShows query to trigger a refetch
    queryClient.invalidateQueries("favouriteTVShows");
  };

  // Render the IconButton with the DeleteIcon
  return (
    <IconButton aria-label="remove from favorites" onClick={onUserRequest}>
      <DeleteIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromFavouritesIcon;