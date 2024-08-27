import React from "react";
import { useParams } from "react-router-dom";
import TVShowDetails from "../components/tvShowDetails";
import PageTemplate from "../components/templateTVShowPage";
import { getTVShow } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
import { TVShowDetailsProps } from "../types/interfaces";
import { useLanguage } from '../contexts/languageContext';

// Component to display the details of a specific TV show
const TVShowDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the TV show ID from the URL parameters
  const { language } = useLanguage(); // Get the current language from context
  console.log("Current language in TVShowDetailsPage:", language); // Log the language value

  // Query to fetch TV show details using react-query
  const { data: show, error, isLoading, isError } = useQuery<TVShowDetailsProps, Error>(
    ["tvShow", id, language],
    () => getTVShow(id || "", language)
  );

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Show error message if there's an error
  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  // Render the page template with the TV show details
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