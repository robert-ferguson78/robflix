import React, { useState } from "react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
import { getMovieImages, getFeaturedMovieImage } from "../../api/tmdb-api";
import { MovieImage, MovieDetailsProps } from "../../types/interfaces";
import { useQuery } from "react-query";
import Spinner from '../spinner';
import Slider from "react-slick";
import Button from "@mui/material/Button";
import img from '../../images/film-poster-placeholder.png';

// Props for the TemplateMoviePage component
interface TemplateMoviePageProps {
    movie: MovieDetailsProps;
    children: React.ReactElement;
}

// Props for the custom arrow components
interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

// Custom next arrow component for the slider
const NextArrow: React.FC<ArrowProps> = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "black" }}
            onClick={onClick}
        />
    );
};

// Custom previous arrow component for the slider
const PrevArrow: React.FC<ArrowProps> = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "black" }}
            onClick={onClick}
        />
    );
};

// Main component for the movie page template
const TemplateMoviePage: React.FC<TemplateMoviePageProps> = ({ movie, children }) => {
    const [showSlider, setShowSlider] = useState(false);

    // Query to fetch movie images
    const { data: imagesData, error: imagesError, isLoading: isImagesLoading, isError: isImagesError, refetch: refetchImages } = useQuery<MovieImage[], Error>(
        ["images", movie.id],
        () => getMovieImages(movie.id),
        { enabled: false } // Disable automatic query execution
    );

    // Query to fetch the featured movie image
    const { data: featuredImage, error: featuredImageError, isLoading: isFeaturedImageLoading, isError: isFeaturedImageError } = useQuery<MovieImage | null, Error>(
        ["featuredImage", movie.id],
        () => getFeaturedMovieImage(movie.id)
    );

    // Show spinner while loading the featured image
    if (isFeaturedImageLoading) {
        return <Spinner />;
    }

    // Show error message if there is an error loading the featured image
    if (isFeaturedImageError) {
        return <h1>{featuredImageError.message}</h1>;
    }

    // Handle toggle for the slider
    const handleToggleSlider = () => {
        if (!showSlider) {
            refetchImages();
        }
        setShowSlider(!showSlider);
    };

    // Settings for the slider component
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <>
            {/* Movie header component */}
            <MovieHeader {...movie} />

            {/* Main content grid */}
            <Grid container spacing={5} style={{ padding: "15px" }}>
                <Grid item xs={4}>
                    <img
                        src={featuredImage ? `https://image.tmdb.org/t/p/w500/${featuredImage.file_path}` : img}
                        alt={`Featured ${movie.title} Poster`}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Grid>
                <Grid item xs={8}>
                    {children}
                </Grid>
            </Grid>

            {/* Slider toggle button and slider grid */}
            <Grid container spacing={5} style={{ padding: "15px", textAlign: "center" }}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleToggleSlider}>
                        {showSlider ? "Hide Film Posters" : "More Film Posters"}
                    </Button>
                </Grid>
                {showSlider && (
                    <Grid item xs={12}>
                        {isImagesLoading ? (
                            <Spinner />
                        ) : isImagesError ? (
                            <h1>{imagesError.message}</h1>
                        ) : (
                            <Slider {...sliderSettings}>
                                {imagesData && imagesData.map((image: MovieImage) => (
                                    <div key={image.file_path}>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                                            alt={`More Featured ${movie.title} Posters`}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        )}
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default TemplateMoviePage;