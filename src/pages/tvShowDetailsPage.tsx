import React from "react";
import { useParams } from "react-router-dom";
import TVShowDetails from "../components/tvShowDetails";
import PageTemplate from "../components/templateTVShowPage";
import { getTVShow } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
import { TVShowDetailsProps } from "../types/interfaces";
import { useLanguage } from '../contexts/languageContext';

const TVShowDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  console.log("Current language in TVShowDetailsPage:", language); // Log the language value

  const { data: show, error, isLoading, isError } = useQuery<TVShowDetailsProps, Error>(
    ["tvShow", id, language],
    () => getTVShow(id || "", language)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  return (
    <>
      {show ? (
        <PageTemplate show={show}>
          <TVShowDetails {...show} />
        </PageTemplate>
      ) : (
        <p>Waiting for TV show details</p>
      )}
    </>
  );
};

export default TVShowDetailsPage;