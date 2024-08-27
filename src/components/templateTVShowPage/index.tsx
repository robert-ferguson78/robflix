import React from "react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import TVShowHeader from "../tvShowHeader";
import Grid from "@mui/material/Grid";
import { getFeaturedTVShowImage } from "../../api/tmdb-api";
import { TVShowImage, TVShowDetailsProps } from "../../types/interfaces";
import { useQuery } from "react-query";
import Spinner from '../spinner';
import img from '../../images/film-poster-placeholder.png';

// Props for the TemplateTVShowPage component
interface TemplateTVShowPageProps {
    show: TVShowDetailsProps;
    children: React.ReactElement;
}

// Main component for the TV show page template
const TemplateTVShowPage: React.FC<TemplateTVShowPageProps> = ({ show, children }) => {

    // Query to fetch the featured TV show image
    const { data: featuredImage, error: featuredImageError, isLoading: isFeaturedImageLoading, isError: isFeaturedImageError } = useQuery<TVShowImage, Error>(
        ["featuredImage", show.id],
        () => getFeaturedTVShowImage(show.id)
    );

    // Show spinner while loading the featured image
    if (isFeaturedImageLoading) {
        return <Spinner />;
    }

    // Show error message if there is an error loading the featured image
    if (isFeaturedImageError) {
        return <h1>{featuredImageError.message}</h1>;
    }

    return (
        <>
            {/* TV show header component */}
            <TVShowHeader {...show} />

            {/* Main content grid */}
            <Grid container spacing={5} style={{ padding: "15px" }}>
                <Grid item xs={4}>
                    <img
                        src={featuredImage?.file_path ? `https://image.tmdb.org/t/p/w500/${featuredImage.file_path}` : img}
                        alt={`Featured ${show.name} Poster`}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Grid>
                <Grid item xs={8}>
                    {children}
                </Grid>
            </Grid>
        </>
    );
};

export default TemplateTVShowPage;