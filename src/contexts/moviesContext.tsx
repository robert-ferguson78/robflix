import React, { useState, useCallback, useEffect } from "react";
import { BaseMovieProps, Review, Genre } from "../types/interfaces";
import { getMovies, getGenres } from "../api/tmdb-api";
import { useLanguage } from '../contexts/languageContext';

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

export const MoviesContext = React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { language } = useLanguage();
    const [favourites, setFavourites] = useState<number[]>([]);
    const [_, setMyReviews] = useState<Review[]>([]);
    const [mustPlaylist, setMustPlaylist] = useState<number[]>([]);
    const [movies, setMovies] = useState<BaseMovieProps[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

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
            setMustPlaylist,
            setFavourites
        }}>
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;