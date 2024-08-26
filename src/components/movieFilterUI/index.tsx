import React, { useState, useEffect } from "react";
import FilterCard from "../filterMoviesCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { MovieFilterUIProps } from "../../types/interfaces";

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

const MovieFilterUI: React.FC<MovieFilterUIProps> = ({
  onFilterValuesChange,
  titleFilter,
  genreFilter,
  sortOption,
  resetFilters,
  language,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    console.log(`Language prop: ${language}`);
  }, [language]);

  return (
    <>
      <Fab
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
          language={language}
        />
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