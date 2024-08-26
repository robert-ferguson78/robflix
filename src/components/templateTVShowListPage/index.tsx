import React from "react";
import Grid from "@mui/material/Grid";
import Header from "../headerTVList";
import TVShowList from "../tvShowsList";
import { BaseTVShowProps } from "../../types/interfaces";

interface TemplateTVShowListPageProps {
  name: string;
  shows: BaseTVShowProps[];
  action: (show: BaseTVShowProps) => JSX.Element;
}

const styles = {
  root: { 
    backgroundColor: "#bfbfbf",
  }
};

const TemplateTVShowListPage: React.FC<TemplateTVShowListPageProps> = ({ name, shows, action }) => {
  return (
    <Grid container sx={styles.root}>
      <Grid item xs={12}>
        <Header name={name} />
      </Grid>
      <Grid item container spacing={5}>
        <TVShowList action={action} shows={shows} />
      </Grid>
    </Grid>
  );
};

export default TemplateTVShowListPage;