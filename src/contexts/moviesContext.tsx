import React, { useState, useCallback } from "react";
import { BaseMovieProps, Review } from "../types/interfaces";

interface MovieContextInterface {
    favourites: number[];
    mustPlaylist: number[];
    addToFavourites: (movie: BaseMovieProps) => void;
    removeFromFavourites: (movie: BaseMovieProps) => void;
    removeFromPlaylist: (movie: BaseMovieProps) => void;
    addReview: (movie: BaseMovieProps, review: Review) => void;
    addToPlaylist: (movie: BaseMovieProps) => void;
}

const initialContextState: MovieContextInterface = {
    favourites: [],
    mustPlaylist: [],
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

    const addToFavourites = useCallback((movie: BaseMovieProps) => {
        console.log("addToFavourites called with movie:", movie);
        setFavourites((prevFavourites) => {
            if (!prevFavourites.includes(movie.id)) {
                return [...prevFavourites, movie.id];
            }
            return prevFavourites;
        });
    }, []);

    const removeFromFavourites = useCallback((movie: BaseMovieProps) => {
        console.log("removeFromFavourites called with movie:", movie);
        setFavourites((prevFavourites) => prevFavourites.filter((mId) => mId !== movie.id));
    }, []);

    const removeFromPlaylist = useCallback((movie: BaseMovieProps) => {
        console.log("removeFromPlaylist called with movie:", movie);
        setMustPlaylist((prevMustPlaylist) => prevMustPlaylist.filter((mId) => mId !== movie.id));
    }, []);

    const addReview = (movie: BaseMovieProps, review: Review) => {
        console.log("addReview called with movie:", movie, "and review:", review);
        setMyReviews((prevReviews) => [...prevReviews, { ...review, movieId: movie.id }]);
    };

    const addToPlaylist = useCallback((movie: BaseMovieProps) => {
        console.log("addToPlaylist called with movie:", movie);
        setMustPlaylist((prevMustPlaylist) => {
            if (!prevMustPlaylist.includes(movie.id)) {
                return [...prevMustPlaylist, movie.id];
            }
            return prevMustPlaylist;
        });
    }, []);

    return (
        <MoviesContext.Provider
            value={{
                favourites,
                mustPlaylist,
                addToFavourites,
                addToPlaylist,
                removeFromFavourites,
                removeFromPlaylist,
                addReview,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;