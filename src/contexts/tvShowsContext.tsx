import React, { useState, useCallback, useEffect } from "react";
import { BaseTVShowProps, Review, Genre } from "../types/interfaces";
import { getTVShows, getTVGenres } from "../api/tmdb-api";
import { useLanguage } from '../contexts/languageContext';

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

export const TVShowsContext = React.createContext<TVShowContextInterface>(initialContextState);

const TVShowsContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { language } = useLanguage();
    const [favourites, setFavourites] = useState<number[]>([]);
    // Using _ to ignore the value of the state
    const [_, setMyReviews] = useState<Review[]>([]);
    const [mustPlaylist, setMustPlaylist] = useState<number[]>([]);
    const [tvShows, setTVShows] = useState<BaseTVShowProps[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);

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

    const addToFavourites = useCallback((show: BaseTVShowProps) => {
        setFavourites((prevFavourites) => {
            if (!prevFavourites.includes(show.id)) {
                return [...prevFavourites, show.id];
            }
            return prevFavourites;
        });
    }, []);

    const removeFromFavourites = useCallback((show: BaseTVShowProps) => {
        setFavourites((prevFavourites) => prevFavourites.filter((mId) => mId !== show.id));
    }, []);

    const removeFromPlaylist = useCallback((show: BaseTVShowProps) => {
        setMustPlaylist((prevMustPlaylist) => prevMustPlaylist.filter((mId) => mId !== show.id));
    }, []);

    const addReview = (show: BaseTVShowProps, review: Review) => {
        setMyReviews((prevReviews) => [...prevReviews, { ...review, showId: show.id }]);
    };

    const addToPlaylist = useCallback((show: BaseTVShowProps) => {
        setMustPlaylist((prevMustPlaylist) => {
            if (!prevMustPlaylist.includes(show.id)) {
                return [...prevMustPlaylist, show.id];
            }
            return prevMustPlaylist;
        });
    }, []);

    return (
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