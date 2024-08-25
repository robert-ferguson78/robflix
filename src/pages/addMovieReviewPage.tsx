import React, { useEffect } from "react";
import PageTemplate from "../components/templateMoviePage";
import ReviewForm from "../components/reviewForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import { MovieDetailsProps } from "../types/interfaces";
import { useLanguage } from '../contexts/languageContext';

const WriteReviewPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const { movieId } = location.state || {};

    useEffect(() => {
        console.log("Location state:", location.state);
        console.log("Movie ID:", movieId);
        if (!movieId) {
            console.error("No state or movieId found in location");
            // Temporarily disable the redirect
            // navigate('/'); // Redirect to home page as fallback
        }
    }, [movieId, navigate, location.state]);

    const { data: movie, error, isLoading, isError } = useQuery<MovieDetailsProps, Error>(
        ["movie", movieId],
        () => getMovie(movieId, language),
        {
            enabled: !!movieId, // Only run the query if movieId is truthy
        }
    );

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    return (
        <>
            {movie ? (
                <PageTemplate movie={movie}>
                    <ReviewForm {...movie} />
                </PageTemplate>
            ) : (
                <p>Waiting for movie review details</p>
            )}
        </>
    );
};

export default WriteReviewPage;