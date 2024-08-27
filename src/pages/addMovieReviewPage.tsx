import React, { useEffect } from "react";
import PageTemplate from "../components/templateMoviePage";
import ReviewForm from "../components/reviewForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import { MovieDetailsProps } from "../types/interfaces";
import { useLanguage } from '../contexts/languageContext';

// Component for writing a movie review
const WriteReviewPage: React.FC = () => {
    const location = useLocation(); // Hook to access the current location
    const navigate = useNavigate(); // Hook to navigate programmatically
    const { language } = useLanguage(); // Get the current language from context

    // Extract movieId from the location state
    const { movieId } = location.state || {};

    // Effect to log location state and movieId, and handle missing movieId
    useEffect(() => {
        console.log("Location state:", location.state);
        console.log("Movie ID:", movieId);
        if (!movieId) {
            console.error("No state or movieId found in location");
            // Temporarily disable the redirect
            // navigate('/'); // Redirect to home page as fallback
        }
    }, [movieId, navigate, location.state]);

    // Fetch movie details using react-query
    const { data: movie, error, isLoading, isError } = useQuery<MovieDetailsProps, Error>(
        ["movie", movieId],
        () => getMovie(movieId, language),
        {
            enabled: !!movieId, // Only run the query if movieId is truthy
        }
    );

    // Show spinner while loading
    if (isLoading) {
        return <Spinner />;
    }

    // Show error message if there's an error
    if (isError) {
        return <h1>{error.message}</h1>;
    }

    // Render the page template with the review form if movie data is available
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