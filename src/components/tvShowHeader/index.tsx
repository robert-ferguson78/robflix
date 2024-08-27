import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { BaseTVShowProps } from "../../types/interfaces";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Define styles for the component
const styles = {
  root: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 1.5,
    backgroundColor: "#b90000",
  },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
  whiteColour: {
    color: "#ffffff", // Custom color for ArrowForwardIcon
  },
};

// Main component for the TV show header
const TVShowHeader: React.FC<BaseTVShowProps> = (show) => {
  // Retrieve favourites from local storage
  const favourites = JSON.parse(localStorage.getItem("favourites") || '[]');
  // Check if the current show is in the favourites list
  const isFavourite = favourites.find((favourite: BaseTVShowProps) => favourite.id === show.id);
  
  return (
    // Paper component to contain the header elements
    <Paper component="div" sx={styles.root}>
      {/* Icon button to go back */}
      <IconButton aria-label="go back">
        <ArrowBackIcon sx={styles.whiteColour} fontSize="large" />
      </IconButton>
      {/* Display favourite icon if the show is a favourite */}
      {
        isFavourite ? (
          <Avatar sx={styles.avatar}>
            <FavoriteIcon />
          </Avatar>
        ) : null
      }
      {/* Display the show name */}
      <Typography sx={styles.whiteColour} variant="h4" component="h3">
        {show.name}{" "}
      </Typography>
      {/* Icon button to go forward */}
      <IconButton aria-label="go forward">
        <ArrowForwardIcon sx={styles.whiteColour} fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default TVShowHeader;