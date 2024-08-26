import { BaseMovieProps, BaseTVShowProps } from "../types/interfaces";
import { useState } from "react";

interface Filter<T> {
  name: string;
  value: string;
  condition: (item: T | T[], value: string) => boolean | T[];
  type?: 'filter' | 'sort';
}

const useFiltering = <T,>(filters: Filter<T>[]) => {
  const [filterValues, setFilterValues] = useState(filters.map(f => ({
    name: f.name,
    value: f.value,
  })));

  const filteringConditions = filters.filter(f => f.type !== 'sort').map((f) => f.condition);
  const sortingConditions = filters.filter(f => f.type === 'sort').map((f) => f.condition);

  const filterFunction = (collection: T[]) => {
    console.log("Collection before filtering:", collection);
    let filteredData = filteringConditions.reduce((data, conditionFn, index) => {
      console.log(`Applying filter: ${filterValues[index].name}, value: ${filterValues[index].value}`);
      return data.filter((item) => {
        const result = conditionFn(item, filterValues[index].value) as boolean;
        console.log(`Filter result for item: ${JSON.stringify(item)}, result: ${result}`);
        return result;
      });
    }, collection);

    if (sortingConditions.length > 0) {
      filteredData = sortingConditions.reduce((data, conditionFn) => {
        // Find the sort filter value, defaulting to an empty string if not found
        const sortFilter = filterValues.find(filter => filter.name === "sort")?.value || "";
        console.log(`Applying sort: ${sortFilter}`);
        return conditionFn(data, sortFilter) as T[];
      }, filteredData);
    }

    console.log("Filtered data after applying all filters and sorts:", filteredData);
    return filteredData;
  };

  return {
    filterValues,
    setFilterValues,
    filterFunction,
  };
};

export default useFiltering;

// Movie Filters
export const titleFilter = (movie: BaseMovieProps, value: string): boolean => {
  const result = movie.title?.toLowerCase().includes(value.toLowerCase()) ?? false;
  console.log(`titleFilter - Movie: ${movie.title}, Value: ${value}, Result: ${result}`);
  return result;
};

export const genreFilter = (movie: BaseMovieProps, value: string): boolean => {
  const genreId = Number(value);
  const genreIds = movie.genre_ids;
  const result = genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
  console.log(`genreFilter - Movie: ${movie.title}, GenreId: ${genreId}, GenreIds: ${genreIds}, Result: ${result}`);
  return result;
};

export const sortFilter = (movies: BaseMovieProps[], value: string): BaseMovieProps[] => {
  if (!Array.isArray(movies)) return [];
  
  let sortedMovies;
  switch (value) {
    case "name":
      sortedMovies = movies.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "highRating":
      sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
      break;
    case "lowRating":
      sortedMovies = movies.sort((a, b) => a.vote_average - b.vote_average);
      break;
    case "releaseDate":
      sortedMovies = movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
      break;
    default:
      sortedMovies = movies;
  }
  console.log(`sortFilter - Sort by: ${value}, Result:`, sortedMovies);
  return sortedMovies;
};

// TV Show Filters
export const tvTitleFilter = (show: BaseTVShowProps, value: string): boolean => {
  const result = show.name?.toLowerCase().includes(value.toLowerCase()) ?? false;
  console.log(`tvTitleFilter - Show: ${show.name}, Value: ${value}, Result: ${result}`);
  return result;
};

export const tvGenreFilter = (show: BaseTVShowProps, value: string): boolean => {
  const genreId = Number(value);
  const genreIds = show.genre_ids;
  const result = genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
  console.log(`tvGenreFilter - Show: ${show.name}, GenreId: ${genreId}, GenreIds: ${genreIds}, Result: ${result}`);
  if (!result) {
    console.log(`tvGenreFilter - No match for GenreId: ${genreId} in Show: ${show.name} with GenreIds: ${genreIds}`);
  }
  return result;
};

export const tvSortFilter = (shows: BaseTVShowProps[], value: string): BaseTVShowProps[] => {
  if (!Array.isArray(shows)) return [];
  
  let sortedShows;
  switch (value) {
    case "name":
      sortedShows = shows.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "highRating":
      sortedShows = shows.sort((a, b) => b.vote_average - a.vote_average);
      break;
    case "lowRating":
      sortedShows = shows.sort((a, b) => a.vote_average - b.vote_average);
      break;
    case "releaseDate":
      sortedShows = shows.sort((a, b) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime());
      break;
    default:
      sortedShows = shows;
  }
  console.log(`tvSortFilter - Sort by: ${value}, Result:`, sortedShows);
  return sortedShows;
};

export const genreFilterFavourites = (movie: BaseMovieProps, value: string): boolean => {
  const genreId = Number(value);
  const genreIds = movie.genre_ids || []; // Ensure genre_ids is an array
  const result = genreId === 0 || (genreIds.length > 0 && genreIds.includes(genreId));
  console.log(`genreFilterFavourites - Movie: ${movie.title}, GenreId: ${genreId}, GenreIds: ${genreIds}, Result: ${result}`);
  return result;
};

export const tvGenreFilterFavourites = (show: BaseTVShowProps, value: string): boolean => {
  const genreId = Number(value);
  const genreIds = show.genre_ids || []; // Ensure genre_ids is an array
  const result = genreId === 0 || (genreIds.length > 0 && genreIds.includes(genreId));
  console.log(`tvGenreFilterFavourites - Show: ${show.name}, GenreId: ${genreId}, GenreIds: ${genreIds}, Result: ${result}`);
  return result;
};