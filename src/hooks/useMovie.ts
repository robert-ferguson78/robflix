import { useEffect, useState } from "react";
import { getMovie } from '../api/tmdb-api';
import { MovieDetailsProps } from '../types/interfaces';
import { useLanguage } from '../contexts/languageContext';

// Define the return type for the custom hook
type MovieHookReturnType = [MovieDetailsProps | undefined, React.Dispatch<React.SetStateAction<MovieDetailsProps | undefined>>];

// Custom hook to fetch movie details based on the movie ID
const useMovie = (id: string): MovieHookReturnType => {
    const [movie, setMovie] = useState<MovieDetailsProps>(); // State to hold the movie details
    const { language } = useLanguage(); // Get the current language from context

    // Effect to fetch movie details whenever the movie ID or language changes
    useEffect(() => {
        getMovie(id, language).then(movie => {
            setMovie(movie); // Update the state with the fetched movie details
        });
    }, [id, language]); // Dependencies array to re-run the effect when ID or language changes

    return [movie, setMovie]; // Return the movie details and the state setter function
};

export default useMovie;