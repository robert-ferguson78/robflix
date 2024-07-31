import truncate from "lodash/truncate";
import { createContext, useContext } from 'react';
import { AuthContextType } from "./types/interfaces";
import { BaseMovieProps } from "./types/interfaces";

export const excerpt = (string: string) => {
    return truncate(string, {
        length: 400,
        separator: /,?\.* +/,
    });
}

// Create a context for authentication with an initial value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  // Get the context value
  const context = useContext(AuthContext);
  // If the context is undefined, throw an error
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const filterUpcomingMovies = (movies: BaseMovieProps[]) => {
  const today = new Date();
  return movies.filter(movie => new Date(movie.release_date) >= today);
};