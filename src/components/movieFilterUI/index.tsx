import React, { useState, useEffect } from "react";
import FilterCard from "../filterMoviesCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { MovieFilterUIProps } from "../../types/interfaces";

// Define styles for various components
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

// Define the MovieFilterUI component
const MovieFilterUI: React.FC<MovieFilterUIProps> = ({
  onFilterValuesChange,
  titleFilter,
  genreFilter,
  sortOption,
  resetFilters,
  language,
}) => {
  // State to manage the drawer's open/close status
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Log the language prop whenever it changes
  useEffect(() => {
    console.log(`Language prop: ${language}`);
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

      {/* Drawer containing the filter options */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {/* Filter card component */}
        <FilterCard
          onUserInput={onFilterValuesChange}
          titleFilter={titleFilter}
          genreFilter={genreFilter}
          sortOption={sortOption}
          language={language}
        />
        {/* Button to reset filters */}
        <Button
          variant="outlined"
          onClick={resetFilters}
          color="primary"
        >
          Reset Filters
        </Button>
      </Drawer>
    </>
  );
};

export default MovieFilterUI;