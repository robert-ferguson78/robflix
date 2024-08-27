import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRate from "@mui/icons-material/StarRate";
import Typography from "@mui/material/Typography";
import { TVShowDetailsProps } from "../../types/interfaces";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import TVShowReviews from '../tvReviews';
import { styled } from '@mui/material/styles';
import GoBackButton from '../goBackButton';

// Define styles for various components
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

// Styled component for images
const StyledImg = styled('img')({
    width: 'auto',
    height: 'auto',
    maxHeight: '50px',
});

// Main component for TV show details
const TVShowDetails: React.FC<TVShowDetailsProps> = (show) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            {/* Main grid container */}
            <Grid container sx={{ backgroundColor: "#ffffff", padding: 2 }}>
                {/* Go back button */}
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <GoBackButton />
                </Grid>
                {/* Overview section */}
                <Typography variant="h5" component="h3">
                    Overview
                </Typography>
                <Typography variant="h6" component="p">
                    {show.overview}
                </Typography>
                {/* Genres and other details */}
                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item>
                        <Paper component="ul" sx={styles.chipSet}>
                            <li>
                                <Chip label="Genres" sx={styles.chipLabel} color="primary" />
                            </li>
                            {show.genres.map((g) => (
                                <li key={g.name}>
                                    <Chip label={g.name} />
                                </li>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper component="ul" sx={styles.chipSet}>
                            <Chip 
                                icon={<AccessTimeIcon />}
                                label={show.episode_run_time && show.episode_run_time.length > 0 ? `${show.episode_run_time[0]} min.` : "No Runtime"} 
                            />
                            <Chip
                                icon={<StarRate />}
                                label={`${show.vote_average} based on ${show.vote_count} votes`}
                            />
                            <Chip label={`First Air Date: ${show.first_air_date}`} />
                        </Paper>
                    </Grid>
                </Grid>
                {/* Production companies */}
                <Grid container spacing={5} sx={styles.gridContainer} wrap="wrap">
                    {show.production_companies.map((company) => (
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
            {/* Floating action button for reviews */}
            <Fab
                variant="extended"
                onClick={() => setDrawerOpen(true)}
                sx={styles.fab}
            >
                <NavigationIcon />
                Reviews
            </Fab>
            {/* Drawer for reviews */}
            <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <TVShowReviews {...show} />
            </Drawer>
        </>
    );
};

export default TVShowDetails;