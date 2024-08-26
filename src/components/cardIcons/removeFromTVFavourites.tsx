import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TVShowsContext } from "../../contexts/tvShowsContext";
import { BaseTVShowProps } from "../../types/interfaces";
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

const RemoveFromFavouritesIcon: React.FC<BaseTVShowProps> = (show) => {
  const context = useContext(TVShowsContext);
  const queryClient = useQueryClient();

  const removeFromLocalStorage = (showId: number) => {
    const storedFavourites = JSON.parse(localStorage.getItem("favouriteTVShows") || "[]");
    const updatedFavourites = storedFavourites.filter((id: number) => id !== showId);
    localStorage.setItem("favouriteTVShows", JSON.stringify(updatedFavourites));

    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  const onUserRequest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.removeFromFavourites(show);

    const userId = auth.currentUser?.uid; // Get the authenticated user's ID
    if (userId) {
      await userFirestoreStore.removeFavouriteTVShow(userId, show.id.toString()); // Remove the show from Firestore
    }

    // Remove from local storage
    removeFromLocalStorage(show.id);

    // Invalidate the favouriteTVShows query to trigger a refetch
    queryClient.invalidateQueries("favouriteTVShows");
  };

  return (
    <IconButton aria-label="remove from favorites" onClick={onUserRequest}>
      <DeleteIcon sx={styles.buttonStyle} fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromFavouritesIcon;