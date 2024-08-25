import { useEffect, useState } from "react";
import { getMovie } from '../api/tmdb-api';
import { MovieDetailsProps } from '../types/interfaces';
import { useLanguage } from '../contexts/languageContext';

type MovieHookReturnType = [MovieDetailsProps | undefined, React.Dispatch<React.SetStateAction<MovieDetailsProps | undefined>>];

const useMovie = (id: string): MovieHookReturnType => {
    const [movie, setMovie] = useState<MovieDetailsProps>();
    const { language } = useLanguage(); // Get the current language

    useEffect(() => {
        getMovie(id, language).then(movie => {
            setMovie(movie);
        });
    }, [id, language]); // Add language to the dependency array

    return [movie, setMovie];
};

export default useMovie;