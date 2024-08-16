import React, { useState, useCallback, useEffect } from "react";
import { BaseMovieProps, Review, Genre } from "../types/interfaces";
import { getMovies, getTVGenres } from "../api/tmdb-api";

interface MovieContextInterface {
    favourites: number[];
    mustPlaylist: number[];
    movies: BaseMovieProps[];
    genres: Genre[];
    addToFavourites: (movie: BaseMovieProps) => void;
    removeFromFavourites: (movie: BaseMovieProps) => void;
    removeFromPlaylist: (movie: BaseMovieProps) => void;
    addReview: (movie: BaseMovieProps, review: Review) => void;
    addToPlaylist: (movie: BaseMovieProps) => void;
}

const initialContextState: MovieContextInterface = {
    favourites: [],
    mustPlaylist: [],
    movies: [],
    genres: [],
    addToFavourites: () => {},
    removeFromFavourites: () => {},
    removeFromPlaylist: () => {},
    addReview: () => {},
    addToPlaylist: () => {},
};

export const MoviesContext = React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [favourites, setFavourites] = useState<number[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [mustPlaylist, setMustPlaylist] = useState<number[]>([]);
    const [movies, setMovies] = useState<BaseMovieProps[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const fetchMoviesAndGenres = async () => {
            try {
                const moviesData = await getMovies();
                const genresData = await getTVGenres();
                setMovies(moviesData.results);
                setGenres(genresData.genres);
            } catch (error) {
                console.error("Failed to fetch movies or genres:", error);
            }
        };
        fetchMoviesAndGenres();
    }, []);

    const addToFavourites = useCallback((movie: BaseMovieProps) => {
        setFavourites((prevFavourites) => {
            if (!prevFavourites.includes(movie.id)) {
                return [...prevFavourites, movie.id];
            }
            return prevFavourites;
        });
    }, []);

    const removeFromFavourites = useCallback((movie: BaseMovieProps) => {
        setFavourites((prevFavourites) => prevFavourites.filter((mId) => mId !== movie.id));
    }, []);

    const removeFromPlaylist = useCallback((movie: BaseMovieProps) => {
        setMustPlaylist((prevMustPlaylist) => prevMustPlaylist.filter((mId) => mId !== movie.id));
    }, []);

    const addReview = (movie: BaseMovieProps, review: Review) => {
        setMyReviews((prevReviews) => [...prevReviews, { ...review, movieId: movie.id }]);
    };

    const addToPlaylist = useCallback((movie: BaseMovieProps) => {
        setMustPlaylist((prevMustPlaylist) => {
            if (!prevMustPlaylist.includes(movie.id)) {
                return [...prevMustPlaylist, movie.id];
            }
            return prevMustPlaylist;
        });
    }, []);

    return (
        <MoviesContext.Provider value={{
            favourites,
            mustPlaylist,
            movies,
            genres,
            addToFavourites,
            removeFromFavourites,
            removeFromPlaylist,
            addReview,
            addToPlaylist
        }}>
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;