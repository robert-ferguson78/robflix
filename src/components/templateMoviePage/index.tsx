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

interface TemplateMoviePageProps {
    movie: MovieDetailsProps;
    children: React.ReactElement;
}

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

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

const TemplateMoviePage: React.FC<TemplateMoviePageProps> = ({ movie, children }) => {
    const [showSlider, setShowSlider] = useState(false);

    const { data: imagesData, error: imagesError, isLoading: isImagesLoading, isError: isImagesError, refetch: refetchImages } = useQuery<MovieImage[], Error>(
        ["images", movie.id],
        () => getMovieImages(movie.id),
        { enabled: false } // Disable automatic query execution
    );

    const { data: featuredImage, error: featuredImageError, isLoading: isFeaturedImageLoading, isError: isFeaturedImageError } = useQuery<MovieImage, Error>(
        ["featuredImage", movie.id],
        () => getFeaturedMovieImage(movie.id)
    );

    if (isFeaturedImageLoading) {
        return <Spinner />;
    }

    if (isFeaturedImageError) {
        return <h1>{featuredImageError.message}</h1>;
    }

    const handleToggleSlider = () => {
        if (!showSlider) {
            refetchImages();
        }
        setShowSlider(!showSlider);
    };

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
            <MovieHeader {...movie} />

            <Grid container spacing={5} style={{ padding: "15px" }}>
                {featuredImage && (
                    <Grid item xs={4}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${featuredImage.file_path}`}
                            alt={`Featured ${movie.title} Poster`}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Grid>
                )}
                <Grid item xs={8}>
                    {children}
                </Grid>
            </Grid>
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