import React from "react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import TVShowHeader from "../tvShowHeader";
import Grid from "@mui/material/Grid";
import { getFeaturedTVShowImage } from "../../api/tmdb-api";
import { TVShowImage, TVShowDetailsProps } from "../../types/interfaces";
import { useQuery } from "react-query";
import Spinner from '../spinner';

interface TemplateTVShowPageProps {
    show: TVShowDetailsProps;
    children: React.ReactElement;
}

const TemplateTVShowPage: React.FC<TemplateTVShowPageProps> = ({ show, children }) => {

    const { data: featuredImage, error: featuredImageError, isLoading: isFeaturedImageLoading, isError: isFeaturedImageError } = useQuery<TVShowImage, Error>(
        ["featuredImage", show.id],
        () => getFeaturedTVShowImage(show.id)
    );

    if (isFeaturedImageLoading) {
        return <Spinner />;
    }

    if (isFeaturedImageError) {
        return <h1>{featuredImageError.message}</h1>;
    }

    return (
        <>
            <TVShowHeader {...show} />

            <Grid container spacing={5} style={{ padding: "15px" }}>
                {featuredImage && (
                    <Grid item xs={4}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${featuredImage.file_path}`}
                            alt={`Featured ${show.name} Poster`}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Grid>
                )}
                <Grid item xs={8}>
                    {children}
                </Grid>
            </Grid>
        </>
    );
};

export default TemplateTVShowPage;