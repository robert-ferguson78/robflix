import React, { useState, useCallback, useEffect } from "react";
import { BaseTVShowProps, Review, Genre } from "../types/interfaces";
import { getTVShows, getTVGenres } from "../api/tmdb-api";
import { useLanguage } from '../contexts/languageContext';

// Define the interface for the TV show context
interface TVShowContextInterface {
    favourites: number[];
    mustPlaylist: number[];
    tvShows: BaseTVShowProps[];
    genres: Genre[];
    addToFavourites: (show: BaseTVShowProps) => void;
    removeFromFavourites: (show: BaseTVShowProps) => void;
    removeFromPlaylist: (show: BaseTVShowProps) => void;
    addReview: (show: BaseTVShowProps, review: Review) => void;
    addToPlaylist: (show: BaseTVShowProps) => void;
    setFavourites: (movies: number[]) => void;
}

// Initial state for the context
const initialContextState: TVShowContextInterface = {
    favourites: [],
    mustPlaylist: [],
    tvShows: [],
    genres: [],
    addToFavourites: () => {},
    removeFromFavourites: () => {},
    removeFromPlaylist: () => {},
    addReview: () => {},
    addToPlaylist: () => {},
    setFavourites: () => {},
};

// Create the context
export const TVShowsContext = React.createContext<TVShowContextInterface>(initialContextState);

// Provider component to wrap the application and provide the TV shows context
const TVShowsContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { language } = useLanguage();
    const [favourites, setFavourites] = useState<number[]>([]);
    // Using _ to ignore the value of the state
    const [_, setMyReviews] = useState<Review[]>([]);
    const [mustPlaylist, setMustPlaylist] = useState<number[]>([]);
    const [tvShows, setTVShows] = useState<BaseTVShowProps[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

    // Fetch TV shows and genres whenever the language changes
    useEffect(() => {
        const fetchTVShowsAndGenres = async () => {
            try {
                const tvShowsData = await getTVShows(language);
                const genresData = await getTVGenres(language);
                setTVShows(tvShowsData.results);
                setGenres(genresData.genres);
            } catch (error) {
                console.error("Failed to fetch TV shows or genres:", error);
            }
        };
        fetchTVShowsAndGenres();
    }, [language]);

    // Add a TV show to favourites
    const addToFavourites = useCallback((show: BaseTVShowProps) => {
        setFavourites((prevFavourites) => {
            if (!prevFavourites.includes(show.id)) {
                return [...prevFavourites, show.id];
            }
            return prevFavourites;
        });
    }, []);

    // Remove a TV show from favourites
    const removeFromFavourites = useCallback((show: BaseTVShowProps) => {
        setFavourites((prevFavourites) => prevFavourites.filter((mId) => mId !== show.id));
    }, []);

    // Remove a TV show from the must-watch playlist
    const removeFromPlaylist = useCallback((show: BaseTVShowProps) => {
        setMustPlaylist((prevMustPlaylist) => prevMustPlaylist.filter((mId) => mId !== show.id));
    }, []);

    // Add a review for a TV show
    const addReview = (show: BaseTVShowProps, review: Review) => {
        setMyReviews((prevReviews) => [...prevReviews, { ...review, showId: show.id }]);
    };

    // Add a TV show to the must-watch playlist
    const addToPlaylist = useCallback((show: BaseTVShowProps) => {
        setMustPlaylist((prevMustPlaylist) => {
            if (!prevMustPlaylist.includes(show.id)) {
                return [...prevMustPlaylist, show.id];
            }
            return prevMustPlaylist;
        });
    }, []);

    return (
        // Provide the context values to the children components
        <TVShowsContext.Provider value={{
            favourites,
            mustPlaylist,
            tvShows,
            genres,
            addToFavourites,
            removeFromFavourites,
            removeFromPlaylist,
            addReview,
            addToPlaylist,
            setFavourites
        }}>
            {children}
        </TVShowsContext.Provider>
    );
};

export default TVShowsContextProvider;