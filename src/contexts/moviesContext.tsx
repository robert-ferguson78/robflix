import React, { useState, useCallback, useEffect } from "react";
import { BaseMovieProps, Review, Genre } from "../types/interfaces";
import { getMovies, getGenres } from "../api/tmdb-api";
import { useLanguage } from '../contexts/languageContext';

// Define the interface for the context
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
    setMustPlaylist: (movies: number[]) => void;
    setFavourites: (movies: number[]) => void;
}

// Initial state for the context
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
    setMustPlaylist: () => {},
    setFavourites: () => {},
};

// Create the context
export const MoviesContext = React.createContext<MovieContextInterface>(initialContextState);

// Provider component to wrap the application and provide the movies context
const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { language } = useLanguage();
    const [favourites, setFavourites] = useState<number[]>([]);
    const [_, setMyReviews] = useState<Review[]>([]);
    const [mustPlaylist, setMustPlaylist] = useState<number[]>([]);
    const [movies, setMovies] = useState<BaseMovieProps[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

    // Fetch movies and genres whenever the language changes
    useEffect(() => {
        const fetchMoviesAndGenres = async () => {
            try {
                const moviesData = await getMovies(language);
                const genresData = await getGenres(language);
                setMovies(moviesData.results);
                setGenres(genresData.genres);
            } catch (error) {
                console.error("Failed to fetch movies or genres:", error);
            }
        };
        fetchMoviesAndGenres();
    }, [language]);

    // Add a movie to favourites
    const addToFavourites = useCallback((movie: BaseMovieProps) => {
        setFavourites((prevFavourites) => {
            if (!prevFavourites.includes(movie.id)) {
                return [...prevFavourites, movie.id];
            }
            return prevFavourites;
        });
    }, []);

    // Remove a movie from favourites
    const removeFromFavourites = useCallback((movie: BaseMovieProps) => {
        setFavourites((prevFavourites) => prevFavourites.filter((mId) => mId !== movie.id));
    }, []);

    // Remove a movie from the must-watch playlist
    const removeFromPlaylist = useCallback((movie: BaseMovieProps) => {
        setMustPlaylist((prevMustPlaylist) => prevMustPlaylist.filter((mId) => mId !== movie.id));
    }, []);

    // Add a review for a movie
    const addReview = (movie: BaseMovieProps, review: Review) => {
        setMyReviews((prevReviews) => [...prevReviews, { ...review, movieId: movie.id }]);
    };

    // Add a movie to the must-watch playlist
    const addToPlaylist = useCallback((movie: BaseMovieProps) => {
        setMustPlaylist((prevMustPlaylist) => {
            if (!prevMustPlaylist.includes(movie.id)) {
                return [...prevMustPlaylist, movie.id];
            }
            return prevMustPlaylist;
        });
    }, []);

    return (
        // Provide the context values to the children components
        <MoviesContext.Provider value={{
            favourites,
            mustPlaylist,
            movies,
            genres,
            addToFavourites,
            removeFromFavourites,
            removeFromPlaylist,
            addReview,
            addToPlaylist,
            setMustPlaylist,
            setFavourites
        }}>
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;