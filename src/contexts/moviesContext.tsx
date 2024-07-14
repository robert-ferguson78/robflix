import React, { useState, useCallback } from "react";
import { BaseMovieProps, Review } from "../types/interfaces";


interface MovieContextInterface {
    favourites: number[];
    mustWatch: number[],
    addToFavourites: ((movie: BaseMovieProps) => void);
    removeFromFavourites: ((movie: BaseMovieProps) => void);
    addReview: ((movie: BaseMovieProps, review: Review) => void);
    addToMustWatch: ((movie: BaseMovieProps) => void);
}
const initialContextState: MovieContextInterface = {
    favourites: [],
    mustWatch: [],
    addToFavourites: () => {},
    removeFromFavourites: () => {},
    addReview: (movie, review) => { movie.id, review},
    addToMustWatch: () => {},
};

export const MoviesContext = React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [favourites, setFavourites] = useState<number[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>( [] );
    const [mustWatch, setMustWatch] = useState<number[]>([]);

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

    const addReview = (movie:BaseMovieProps, review: Review) => {   // NEW
        setMyReviews( {...myReviews, [movie.id]: review } )
      };

    const addToMustWatch = useCallback((movie: BaseMovieProps) => {
    setMustWatch((prevMustWatches) => {
        if (!prevMustWatches.includes(movie.id)) {
        const updatedList = [...prevMustWatches, movie.id];
        console.log(
            `${movie.title} has been added to the Must Watch list, Movie ID: ${movie.id}`,
            updatedList
        );
        return updatedList;
        }
        return prevMustWatches;
    });
    }, []);

    return (
        <MoviesContext.Provider
            value={{
                favourites,
                mustWatch,
                addToFavourites,
                addToMustWatch,
                removeFromFavourites,
                addReview,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;