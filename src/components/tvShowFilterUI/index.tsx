import React, { useState, useEffect } from "react";
import FilterCard from "../filterTVShowsCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { TVShowFilterUIProps } from "../../types/interfaces";

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

const TVShowFilterUI: React.FC<TVShowFilterUIProps> = ({
    onUserInput,
    titleFilter,
    genreFilter,
    sortOption,
    resetFilters,
    language,
  }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        console.log(`Language prop filterUI: ${language}`);
    }, [language]);

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