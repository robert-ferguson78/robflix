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
    () => {
      console.log("Fetching movie details for id:", id);
      return fantasyMovieFirestoreStore.getFantasyMovie(id || "");
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

  return (
    <>
      {movie ? (
        <FantasyMovieDetails {...movie} />
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default FantasyMovieDetailsPage;