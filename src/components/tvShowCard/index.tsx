import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from '../../images/film-poster-placeholder.png';
import { BaseTVShowProps } from "../../types/interfaces";
import Avatar from "@mui/material/Avatar";
import { TVShowsContext } from "../../contexts/tvShowsContext";

const styles = {
  card: { maxWidth: 450 },
  media: { objectFit: "contain", Height: "auto" },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
};

interface TVShowCardProps {
  show: BaseTVShowProps;
  action: (s: BaseTVShowProps) => React.ReactNode;
}

const TVShowCard: React.FC<TVShowCardProps> = ({ show, action }) => {
  const { favourites, addToFavourites } = useContext(TVShowsContext);

  const isFavourite = favourites.includes(show.id);

  useEffect(() => {}, [addToFavourites]);

  return (
    <Card sx={styles.card}>
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
            {show.name}{" "}
          </Typography>
        }
      />
      <CardMedia
        sx={styles.media}
        component="img"
        image={
          show.poster_path
            ? `https://image.tmdb.org/t/p/w500/${show.poster_path}`
            : img
        }
      />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <CalendarIcon fontSize="small" />
              {show.first_air_date}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <StarRateIcon fontSize="small" />
              {"  "} {show.vote_average}{" "}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        {action(show)}
        <Link to={`/tv-shows/${show.id}`}>
          <Button variant="outlined" size="medium" color="primary">
            More Info ...
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default TVShowCard;