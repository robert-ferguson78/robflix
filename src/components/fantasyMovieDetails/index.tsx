import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Typography from "@mui/material/Typography";
import { FantasyMovieProps } from "../../types/interfaces";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

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
    poster: {
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        display: "block",
    },
    title: {
        textAlign: "center",
    },
    button: {
        display: "block",
        margin: "20px auto",
    },
};

// Define the FantasyMovieDetails component
const FantasyMovieDetails: React.FC<FantasyMovieProps> = (movie) => {
    const navigate = useNavigate();

    // Handle the back button click
    const handleBackClick = () => {
        navigate("/movies/fantasy-movies");
    };

    return (
        <>
            <Grid container spacing={2}>
                {/* Movie Poster */}
                <Grid item xs={12} sm={4}>
                    <img src={movie.posterUrl} alt={`${movie.title} poster`} style={styles.poster} />
                </Grid>
                {/* Movie Details */}
                <Grid item xs={12} sm={8}>
                    <Grid container sx={{ backgroundColor: "#ffffff", padding: 2 }}>
                        {/* Movie Overview */}
                        <Grid item xs={12}>
                            <Typography variant="h6" component="p">
                                {movie.overview}
                            </Typography>
                        </Grid>
                        {/* Movie Genres */}
                        <Grid item xs={12}>
                            <Paper component="ul" sx={styles.chipSet}>
                                <li>
                                    <Chip label="Genres" sx={styles.chipLabel} color="primary" />
                                </li>
                                {movie.genres.map((g) => (
                                    <li key={g}>
                                        <Chip label={g} />
                                    </li>
                                ))}
                            </Paper>
                        </Grid>
                        {/* Movie Runtime and Release Date */}
                        <Grid item xs={12} sx={styles.chipSet}>
                            <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} color="primary" />
                            <Chip label={`Released: ${movie.releaseDate}`} color="primary" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* Back Button */}
            <Button variant="contained" color="primary" style={styles.button} onClick={handleBackClick}>
                Back to Fantasy Movies
            </Button>
        </>
    );
};

export default FantasyMovieDetails;