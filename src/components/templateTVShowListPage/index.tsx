import React from "react";
import Grid from "@mui/material/Grid";
import Header from "../tvShowHeader";
import TVShowList from "../tvShowsList";
import { BaseTVShowProps } from "../../types/interfaces";

interface TemplateTVShowListPageProps {
  title: string;
  shows: BaseTVShowProps[];
  action: (show: BaseTVShowProps) => JSX.Element;
}

const TemplateTVShowListPage: React.FC<TemplateTVShowListPageProps> = ({ title, shows, action }) => {
  return (
    <>
      <Header title={title} />
      <Grid container spacing={5}>
        <TVShowList shows={shows} action={action} />
      </Grid>
    </>
  );
};

export default TemplateTVShowListPage;