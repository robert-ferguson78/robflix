import { Link } from "react-router-dom";
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import Grid from "@mui/material/Grid";
import img from '../../images/film-poster-placeholder.png';
import { FantasyMovieCardProp } from "../../types/interfaces";
import { styled } from "@mui/system";

// Define custom styles for the card and its elements
const styles = {
  card: { maxWidth: "100%" },
  media: { objectFit: "contain", height: "auto" },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
  buttonStyle: {
    color: "#ffffff",
    border: "1px solid #ffffff",
    '&:hover': {
      border: "1px solid rgb(255, 0, 0)",
      color: "rgb(255, 0, 0)",
    },
  },
};

// Define a styled component for the overlay that appears on hover
const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 1,
  },
});

// Define a styled container for the overlay
const OverlayContainer = styled('div')({
  position: 'relative',
  '&:hover .overlay': {
    opacity: 1,
  },
});

// Define the FantasyMovieCard component
const FantasyMovieCard: React.FC<FantasyMovieCardProp> = ({ movies }) => {
  return (
    <Card sx={styles.card}>
      <OverlayContainer>
        <CardActionArea>
          <CardMedia
            sx={styles.media}
            component="img"
            image={
              movies.posterUrl
                ? `${movies.posterUrl}`
                : img
            }
          />
          <Overlay className="overlay">
            <CardHeader
              title={
                <Typography variant="h5" component="p">
                  {movies.title}{" "}
                </Typography>
              }
            />
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h6" component="p">
                    <CalendarIcon fontSize="small" />
                    {movies.releaseDate}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions disableSpacing>
              <Link to={`/movies/fantasy-movies/${movies.id}`}>
                <Button variant="outlined" size="medium" sx={styles.buttonStyle}>
                  More Info ...
                </Button>
              </Link>
            </CardActions>
          </Overlay>
        </CardActionArea>
      </OverlayContainer>
    </Card>
  );
};

export default FantasyMovieCard;