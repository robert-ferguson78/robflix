import React, { useState, useEffect } from "react";
import FilterCard from "../filterTVShowsCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { TVShowFilterUIProps } from "../../types/interfaces";

// Define styles for the component
const styles = {
    root: {
        backgroundColor: "#bfbfbf",
    },
    fab: {
        marginTop: 8,
        position: "fixed",
        top: 20,
        right: 2,
        backgroundColor: "#ffffff",
        border: "2px solid #ffffff",
    },
};

// Main component for the TV show filter UI
const TVShowFilterUI: React.FC<TVShowFilterUIProps> = ({
    onUserInput,
    titleFilter,
    genreFilter,
    sortOption,
    resetFilters,
    language,
  }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Log the language prop whenever it changes
    useEffect(() => {
        console.log(`Language prop filterUI: ${language}`);
    }, [language]);

    return (
        <>
            {/* Floating action button to open the filter drawer */}
            <Fab
                variant="extended"
                onClick={() => setDrawerOpen(true)}
                sx={styles.fab}
            >
                Filter
            </Fab>
            {/* Drawer containing the filter card and reset button */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <FilterCard
                    onUserInput={onUserInput}
                    titleFilter={titleFilter}
                    genreFilter={genreFilter}
                    sortOption={sortOption}
                    language={language}
                />
                <Button
                    variant="outlined"
                    onClick={resetFilters}
                    color="primary">
                    Reset Filters
                </Button>
            </Drawer>
        </>
    );
};

export default TVShowFilterUI;