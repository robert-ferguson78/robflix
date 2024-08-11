import { BaseMovieProps } from "../types/interfaces";
import { useState } from "react";

interface Filter {
  name: string;
  value: string;
  condition: (item: BaseMovieProps | BaseMovieProps[], value: string) => boolean | BaseMovieProps[];
  type?: 'filter' | 'sort';
}

const useFiltering = (filters: Filter[]) => {
  const [filterValues, setFilterValues] = useState(() => {
    return filters.map((f) => ({
      name: f.name,
      value: f.value,
    }));
  });

  const filteringConditions = filters.filter(f => f.type !== 'sort').map((f) => f.condition);
  const sortingConditions = filters.filter(f => f.type === 'sort').map((f) => f.condition);

  const filterFunction = (collection: BaseMovieProps[]) => {
    let filteredData = filteringConditions.reduce((data, conditionFn, index) => {
      return data.filter((item) => conditionFn(item, filterValues[index].value) as boolean);
    }, collection);

    if (sortingConditions.length > 0) {
      filteredData = sortingConditions.reduce((data, conditionFn) => {
        // Find the sort filter value, defaulting to an empty string if not found
        const sortFilter = filterValues.find(filter => filter.name === "sort")?.value || "";
        return conditionFn(data, sortFilter) as BaseMovieProps[];
      }, filteredData);
    }

    return filteredData;
  };

  return {
    filterValues,
    setFilterValues,
    filterFunction,
  };
};

export default useFiltering;

export const titleFilter = (movie: BaseMovieProps, value: string): boolean => {
  return movie.title.toLowerCase().includes(value.toLowerCase());
};

export const genreFilter = (movie: BaseMovieProps, value: string): boolean => {
  const genreId = Number(value);
  const genreIds = movie.genre_ids;
  return genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
};

export const sortFilter = (movies: BaseMovieProps[], value: string): BaseMovieProps[] => {
  if (!Array.isArray(movies)) return [];
  
  switch (value) {
    case "name":
      return movies.sort((a, b) => a.title.localeCompare(b.title));
    case "highRating":
      return movies.sort((a, b) => b.vote_average - a.vote_average);
    case "lowRating":
      return movies.sort((a, b) => a.vote_average - b.vote_average);
    case "releaseDate":
      return movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    default:
      return movies;
  }
};

export const genreFilterFavourites = (movie: BaseMovieProps, value: string): boolean => {
  const genreId = Number(value);
  const genreIds = movie.genres ? movie.genres.map(genre => genre.id) : [];
  
  // Log the genre IDs and filter value
  // console.log("Genre IDs:", genreIds, "Filter Value:", genreId);
  
  return genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
};