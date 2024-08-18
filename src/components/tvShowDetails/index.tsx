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
        position: "fixed",
        top: 50,
        right: 2,
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

const TVShowDetails: React.FC<TVShowDetailsProps> = (show) => {

    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <Typography variant="h5" component="h3">
                Overview
            </Typography>

            <Typography variant="h6" component="p">
                {show.overview}
            </Typography>

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
            <Paper component="ul" sx={styles.chipSet}>
                <Chip 
                    icon={<AccessTimeIcon />}
                    // runtime is not always available, so we need to check if it exists before displaying it
                    label={show.episode_run_time && show.episode_run_time.length > 0 ? `${show.episode_run_time[0]} min.` : "No Runtime"} 
                />
                <Chip
                    icon={<StarRate />}
                    label={`${show.vote_average} based on ${show.vote_count} votes`}
                />
                <Chip label={`First Air Date: ${show.first_air_date}`} />
            </Paper>
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
            <Fab
                color="secondary"
                variant="extended"
                onClick={() => setDrawerOpen(true)}
                sx={styles.fab}
            >
                <NavigationIcon />
                Reviews
            </Fab>
            <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <TVShowReviews {...show} />
            </Drawer>
        </>
    );
};

export default TVShowDetails;