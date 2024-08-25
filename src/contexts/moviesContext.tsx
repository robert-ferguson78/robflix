import React, { useState, useCallback, useEffect } from "react";
import { BaseMovieProps, Review, Genre } from "../types/interfaces";
import { getMovies, getGenres } from "../api/tmdb-api";

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
    setMustPlaylist: (movies: number[]) => void; // Add setMustPlaylist to the interface
    setFavourites: (movies: number[]) => void; // Add setFavourites to the interface
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
    setMustPlaylist: () => {}, // Initialize setMustPlaylist
    setFavourites: () => {}, // Initialize setFavourites
};

export const MoviesContext = React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [favourites, setFavourites] = useState<number[]>([]);
    // Using _ to ignore the value of the state
    const [_, setMyReviews] = useState<Review[]>([]);
    const [mustPlaylist, setMustPlaylist] = useState<number[]>([]);
    const [movies, setMovies] = useState<BaseMovieProps[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const fetchMoviesAndGenres = async () => {
            try {
                const moviesData = await getMovies();
                const genresData = await getGenres();
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
            addToPlaylist,
            setMustPlaylist, // Provide setMustPlaylist in the context value
            setFavourites // Provide setFavourites in the context value
        }}>
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;