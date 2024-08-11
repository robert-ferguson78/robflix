import React, { useState } from "react";
import FilterCard from "../filterMoviesCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import { BaseMovieProps, MovieFilterUIProps } from "../../types/interfaces";

export const titleFilter = (movie: BaseMovieProps, value: string): boolean => {
    return movie.title.toLowerCase().search(value.toLowerCase()) !== -1;
};

export const genreFilter = (movie: BaseMovieProps, value: string) => {
    const genreId = Number(value);
    const genreIds = movie.genre_ids;
    return genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
};

export const sortFilter = (movies: BaseMovieProps[], value: string) => {
    console.log("Sorting movies by:", value);
    if (!Array.isArray(movies)) return [];
    
    switch (value) {
        case "name":
            return movies.sort((a, b) => a.title.localeCompare(b.title));
        case "highRating":
            return movies.sort((a, b) => b.vote_average - a.vote_average);
        case "lowRating":
            return movies.sort((a, b) => a.vote_average - b.vote_average);
        case "releaseDate":
            return movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        default:
            return movies;
    }
};

const styles = {
    root: {
        backgroundColor: "#bfbfbf",
    },
    fab: {
        marginTop: 8,
        position: "fixed",
        top: 20,
        right: 2,
    },
};

const MovieFilterUI: React.FC<MovieFilterUIProps> = ({ onFilterValuesChange, titleFilter, genreFilter, sortOption }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <Fab
                color="secondary"
                variant="extended"
                onClick={() => setDrawerOpen(true)}
                sx={styles.fab}
            >
                Filter
            </Fab>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <FilterCard
                    onUserInput={onFilterValuesChange}
                    titleFilter={titleFilter}
                    genreFilter={genreFilter}
                    sortOption={sortOption}
                />
            </Drawer>
        </>
    );
};

export default MovieFilterUI;