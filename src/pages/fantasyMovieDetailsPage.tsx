import React from "react";
import { useParams } from "react-router-dom";
import FantasyMovieDetails from "../components/fantasyMovieDetails";
import { fantasyMovieFirestoreStore } from "../models/fantasy-movie-firestore-store";
import { useQuery } from "react-query";
import Spinner from '../components/spinner';
import { FantasyMovieProps } from "../types/interfaces";

const FantasyMovieDetailsPage: React.FC = () => {
  const { id } = useParams();
  console.log("FantasyMovieDetailsPage: id:", id);

  const { data: movie, error, isLoading, isError } = useQuery<FantasyMovieProps, Error>(
    ["fantasyMovie", id],
    async () => {
      console.log("Fetching movie details for id:", id);
      const movieData = await fantasyMovieFirestoreStore.getFantasyMovie(id || "");
      console.log("Fetched movie data:", movieData);
      return { ...movieData, id: id || "" } as FantasyMovieProps;
    }
  );

  console.log("FantasyMovieDetailsPage: isLoading:", isLoading);
  console.log("FantasyMovieDetailsPage: isError:", isError);
  console.log("FantasyMovieDetailsPage: error:", error);
  console.log("FantasyMovieDetailsPage: movie:", movie);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  if (!movie) {
    return <p>Waiting for movie details</p>;
  }

  return <FantasyMovieDetails {...movie} />;
};

export default FantasyMovieDetailsPage;