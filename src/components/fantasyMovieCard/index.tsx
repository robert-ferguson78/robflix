import { Link } from "react-router-dom";
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import Grid from "@mui/material/Grid";
import img from '../../images/film-poster-placeholder.png';
import { FantasyMovieCardProps } from "../../types/interfaces";

const styles = {
  card: { maxWidth: 345 },
  media: { height: 500 },
};

const FantasyMovieCard: React.FC<FantasyMovieCardProps> = ({ movies }) => {
  return (
    <Card sx={styles.card}>
      <CardHeader
        title={
          <Typography variant="h5" component="p">
            {movies.title}{" "}
          </Typography>
        }
      />
      <CardMedia
        sx={styles.media}
        image={
          movies.posterUrl
            ? `${movies.posterUrl}`
            : img
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
          <Button variant="outlined" size="medium" color="primary">
            More Info ...
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default FantasyMovieCard;