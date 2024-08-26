import React from "react";
import TVShow from "../tvShowCard";
import Grid from "@mui/material/Grid";
import { BaseTVShowListProps } from "../../types/interfaces";

const TVShowList: React.FC<BaseTVShowListProps> = ({ shows, action }) => {
  const showCards = shows.map((s) => (
    <Grid key={s.id} item xs={12} sm={6} md={3} lg={3} xl={3}>
      <TVShow key={s.id} show={s} action={action} />
    </Grid>
  ));
  return showCards;
};

export default TVShowList;