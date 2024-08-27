import React from "react";
import Grid from "@mui/material/Grid";
import Header from "../headerTVList";
import TVShowList from "../tvShowsList";
import { TemplateTVShowListPageProps } from "../../types/interfaces";

// Define styles for the root container
const styles = {
  root: { 
    backgroundColor: "#000000",
  }
};

// Main component for the TV show list page template
const TemplateTVShowListPage: React.FC<TemplateTVShowListPageProps> = ({ name, shows, action, page, setPage, isFetching, totalPages }) => {
  return (
    // Root container with defined styles
    <Grid container sx={styles.root}>
      {/* Header section */}
      <Grid item xs={12}>
        <Header 
          title={name} 
          page={page} 
          setPage={setPage} 
          isFetching={isFetching} 
          totalPages={totalPages} 
        />
      </Grid>
      {/* TV show list section */}
      <Grid item container spacing={5}>
        <TVShowList action={action} shows={shows} />
      </Grid>
    </Grid>
  );
};

export default TemplateTVShowListPage;