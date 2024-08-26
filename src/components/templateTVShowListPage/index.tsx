import React from "react";
import Grid from "@mui/material/Grid";
import Header from "../headerTVList";
import TVShowList from "../tvShowsList";
import { TemplateTVShowListPageProps } from "../../types/interfaces";

const styles = {
  root: { 
    backgroundColor: "#000000",
  }
};

const TemplateTVShowListPage: React.FC<TemplateTVShowListPageProps> = ({ name, shows, action, page, setPage, isFetching, totalPages }) => {
  return (
    <Grid container sx={styles.root}>
      <Grid item xs={12}>
        <Header 
          title={name} 
          page={page} 
          setPage={setPage} 
          isFetching={isFetching} 
          totalPages={totalPages} 
        />
      </Grid>
      <Grid item container spacing={5}>
        <TVShowList action={action} shows={shows} />
      </Grid>
    </Grid>
  );
};

export default TemplateTVShowListPage;