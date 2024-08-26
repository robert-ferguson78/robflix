import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { MovieDetailsProps } from "../../types/interfaces";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";

const styles = {
    root: {  
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 1.5,
    backgroundColor: "#b90000",
  },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
  whiteColour: {
    color: "#ffffff", // Custom color for ArrowForwardIcon
  },
};

const MovieHeader: React.FC<MovieDetailsProps> = (movie) => {
  const favourites = JSON.parse(localStorage.getItem("favourites") || '[]');
  const isFavourite = favourites.find((favourite: MovieDetailsProps) => favourite.id === movie.id);
  
  return (
    <Paper component="div" sx={styles.root}>
      <IconButton aria-label="go back">
        <ArrowBackIcon sx={styles.whiteColour} fontSize="large" />
      </IconButton>
        {
          isFavourite ? (
                <Avatar sx={styles.avatar}>
                  <FavoriteIcon />
                </Avatar>
              ) : null
        }
      <Typography sx={styles.whiteColour} variant="h4" component="h3">
        {movie.title}{"   "}
        <a href={movie.homepage}>
          <HomeIcon color="primary"  fontSize="large"/>
        </a>
        <br />
        <span>{`${movie.tagline}`} </span>
      </Typography>
      <IconButton aria-label="go forward">
        <ArrowForwardIcon sx={styles.whiteColour} fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default MovieHeader;