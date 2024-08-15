import React from "react";
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getMovieImages, getFeaturedMovieImage } from "../../api/tmdb-api";
import { MovieImage, MovieDetailsProps } from "../../types/interfaces";
import { useQuery } from "react-query";
import Spinner from '../spinner';

const styles = {
    gridListRoot: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    gridListTile: {
        width: 450,
        height: '100vh',
    },
};

interface TemplateMoviePageProps {
    movie: MovieDetailsProps;
    children: React.ReactElement;
}


const TemplateMoviePage: React.FC<TemplateMoviePageProps> = ({movie, children}) => {
    const { data: imagesData, error: imagesError, isLoading: isImagesLoading, isError: isImagesError } = useQuery<MovieImage[], Error>(
        ["images", movie.id],
        () => getMovieImages(movie.id)
    );

    const { data: featuredImage, error: featuredImageError, isLoading: isFeaturedImageLoading, isError: isFeaturedImageError } = useQuery<MovieImage, Error>(
        ["featuredImage", movie.id],
        () => getFeaturedMovieImage(movie.id)
    );

    if (isImagesLoading || isFeaturedImageLoading) {
        return <Spinner />;
    }

    if (isImagesError) {
        return <h1>{imagesError.message}</h1>;
    }

    if (isFeaturedImageError) {
        return <h1>{featuredImageError.message}</h1>;
    }

    const images = imagesData as MovieImage[];

    return (
        <>
            <MovieHeader {...movie} />

            <Grid container spacing={5} style={{ padding: "15px" }}>
                {featuredImage && (
                        <Grid item xs={4}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${featuredImage.file_path}`}
                                alt={'Featured Image'}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Grid>
                )}
                        <Grid item xs={8}>
                            {children}
                        </Grid>
            </Grid>
            <Grid container spacing={5} style={{ padding: "15px"}}>
            <Grid item xs={12}>
                    <div>
                        <ImageList cols={1}>
                            {images.map((image: MovieImage) => (
                                <ImageListItem
                                    key={image.file_path}
                                    sx={styles.gridListTile}
                                    cols={1}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                                        alt={'Image alternative'}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </div>
                </Grid>
            </Grid>
        </>
    );
};

export default TemplateMoviePage;