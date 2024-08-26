import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import Typography from "@mui/material/Typography";
import { MovieDetailsProps } from "../../types/interfaces";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import MovieReviews from '../movieReviews';
import EmbedVideo from '../embedVideo'; // Import the new component
import { styled } from '@mui/material/styles';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const styles = {
    chipSet: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        listStyle: "none",
        padding: 1.5,
        margin: 0,
    },
    chipLabel: {
        margin: 0.5,
    },
    fab: {
        marginTop: 8,
        position: "fixed",
        top: 20,
        right: 2,
        backgroundColor: "#ffffff",
        border: "2px solid #ffffff",
    },
    gridContainer: {
        padding: "15px",
        justifyContent: "center",
        alignItems: "center",
    },
    gridItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
};

const StyledImg = styled('img')({
    width: 'auto',
    height: 'auto',
    maxHeight: '50px',
});

const MovieDetails: React.FC<MovieDetailsProps> = (movie) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Log the entire movie data to the console
    useEffect(() => {
        console.log('Movie data:', JSON.stringify(movie, null, 2));
    }, [movie]);

    // Filter YouTube videos
    const youtubeVideos = movie.videos.results.filter(video => video.site === "YouTube");

    // Log the youtubeVideos to the console
    useEffect(() => {
        console.log('YouTube video log:', JSON.stringify(youtubeVideos, null, 2));
    }, [youtubeVideos]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            <Grid container sx={{ backgroundColor: "#ffffff", padding: 2 }}>
                <Typography variant="h5" component="h3">
                    Overview
                </Typography>

                <Typography variant="h6" component="p">
                    {movie.overview}
                </Typography>

                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item>
                        <Paper component="ul" sx={styles.chipSet}>
                            <li>
                                <Chip label="Genres" sx={styles.chipLabel} color="primary" />
                            </li>
                            {movie.genres.map((g) => (
                                <li key={g.name}>
                                    <Chip label={g.name} />
                                </li>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper component="ul" sx={styles.chipSet}>
                            <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
                            <Chip icon={<MonetizationIcon />} label={`${movie.revenue.toLocaleString()}`} />
                            <Chip icon={<StarRate />} label={`${movie.vote_average} based on ${movie.vote_count} votes`} />
                            <Chip label={`Released: ${movie.release_date}`} />
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={5} sx={styles.gridContainer} wrap="wrap">
                    {movie.production_companies.map((company) => (
                        <Grid item key={company.id} sx={styles.gridItem}>
                            {company.logo_path && (
                                <StyledImg
                                    src={`https://image.tmdb.org/t/p/w500/${company.logo_path}`}
                                    alt={`${company.name} (${company.origin_country})`}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Fab
                variant="extended"
                onClick={() => setDrawerOpen(true)}
                sx={styles.fab}
            >
                <NavigationIcon />
                Reviews
            </Fab>
            <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <MovieReviews {...movie} />
            </Drawer>
            <Slider {...sliderSettings}>
                {youtubeVideos.map(video => (
                    <div key={video.id}>
                        <EmbedVideo name={video.name} videoKey={video.key} />
                    </div>
                ))}
            </Slider>
        </>
    );
};

export default MovieDetails;