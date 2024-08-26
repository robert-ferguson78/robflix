import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from '../../images/film-poster-placeholder.png';
import { BaseMovieProps } from "../../types/interfaces";
import Avatar from "@mui/material/Avatar";
import { MoviesContext } from "../../contexts/moviesContext";
import { styled } from "@mui/system";

const styles = {
  card: { maxWidth: "100%" },
  media: { objectFit: "contain", height: "auto" },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
  whitecolour: {
    color: "#ffffff",
    border: "1px solid #ffffff",
    '&:hover': {
      border: "1px solid rgb(255, 0, 0)",
      color: "rgb(255, 0, 0)",
    },
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

const OverlayContainer = styled('div')({
  position: 'relative',
  '&:hover .overlay': {
    opacity: 1,
  },
});

interface MovieCardProps {
  movie: BaseMovieProps;
  action: (m: BaseMovieProps) => React.ReactNode;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, action }) => {
  const { favourites, addToFavourites } = useContext(MoviesContext);

  const isFavourite = favourites.includes(movie.id);

  useEffect(() => {}, [addToFavourites]);

  return (
    <Card sx={styles.card}>
      <OverlayContainer>
        <CardActionArea>
          <CardMedia
            sx={styles.media}
            component="img"
            image={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : img
            }
          />
          <Overlay className="overlay">
            <CardHeader
              avatar={
                isFavourite ? (
                  <Avatar sx={styles.avatar}>
                    <FavoriteIcon />
                  </Avatar>
                ) : null
              }
              title={
                <Typography variant="h5" component="p">
                  {movie.title}{" "}
                </Typography>
              }
            />
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h6" component="p">
                    <CalendarIcon fontSize="small" />
                    {movie.release_date}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="p">
                    <StarRateIcon fontSize="small" />
                    {"  "} {movie.vote_average}{" "}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions disableSpacing>
              {action(movie)}
              <Link to={`/movies/${movie.id}`}>
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
}

export default MovieCard;