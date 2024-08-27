// Movie interfaces

// Represents a genre with an id and name
export interface Genre {
  id: number;
  name: string;
}

// Represents the base properties of a movie
export interface BaseMovieProps {
  title: string;
  budget: number;
  homepage: string | undefined;
  id: number;
  imdb_id: string;
  original_language: string;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  poster_path?: string;
  tagline: string;
  runtime: number;
  revenue: number;
  vote_count: number;
  favourite?: boolean;
  genre_ids?: number[];
  genres?: Genre[]; // Added genres optional for favourite movies filter
}

// Represents the properties for a list of movies
export interface BaseMovieListProps {
  movies: BaseMovieProps[];
  action: (m: BaseMovieProps) => React.ReactNode;
}

// Represents detailed properties of a movie
export interface MovieDetailsProps extends BaseMovieProps {
  genres: Genre[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  adult?: boolean; // Optional properties
  backdrop_path?: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

// Represents an image associated with a movie
export interface MovieImage {
  file_path: string;
  aspect_ratio?: number; // some props are optional...
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

// Represents the properties for a movie page
export interface MoviePageProps {
  movie: MovieDetailsProps;
  images: MovieImage[];
}

// Represents filter options for movies
export type FilterOption = "title" | "genre" | "sort";

// Represents the properties for a movie list page template
export interface MovieListPageTemplateProps extends BaseMovieListProps {
  title: string;
}

// Represents genre data
export interface GenreData {
  genres: Genre[];
}

// Represents the response from a discover movies API call
export interface DiscoverMovies {
  page: number;
  total_pages: number;
  total_results: number;
  results: BaseMovieProps[];
}

// Represents a review for a movie
export interface Review {
  id: number;
  author: string;
  content: string;
  agree: boolean;
  rating: number;
  movieId: number;
  created_at?: string;
  updated_at?: string;
}

// Represents the authentication context type
export interface AuthContextType {
  currentUser: UserId | null;
}

// Represents a user
export interface User {
  uid: string;
  email: string | null;
  favourites: number[];
}

// Represents a user ID
export interface UserId {
  uid: string;
}

// Represents the properties for a private route
export interface PrivateRouteProps {
  element: React.ComponentType; // The component to render if the user is authenticated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional prop types to be passed to the PrivateRoute component
}

// Represents the properties for a fantasy movie
export interface FantasyMovieProps {
  runtime: number;
  overview: string;
  posterUrl: string;
  title: string;
  genres: string[];
  production: string;
  releaseDate: string;
  userUid: string;
  id: string;
}

// Represents the properties for a fantasy movie card
export interface FantasyMovieCardProps {
  movies: FantasyMovieProps[];
  title?: string;
}

// Represents the properties for a single fantasy movie card
export interface FantasyMovieCardProp {
  movies: FantasyMovieProps;
}

// Represents the properties for the movie filter UI
export interface MovieFilterUIProps {
  onFilterValuesChange: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  resetFilters: () => void;
  language: string;
}

// Represents the properties for the filter movies card
export interface FilterMoviesCardProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  language: string;
}

// Represents a poster image
export interface Poster {
  file_path: string;
  vote_count: number;
}

// Represents the properties for a header with pagination
export interface HeaderPropsWithPagination extends HeaderProps {
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  isFetching?: boolean;
  totalPages?: number;
}

// Represents the properties for a movie list page template with pagination
export interface MovieListPageTemplateWithPaginationProps extends MovieListPageTemplateProps {
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  isFetching?: boolean;
  totalPages?: number;
}

// TV show interfaces

// Represents the base properties of a TV show
export interface BaseTVShowProps {
  name: string;
  id: number;
  overview: string;
  first_air_date: string;
  vote_average: number;
  popularity: number;
  poster_path?: string;
  genre_ids?: number[];
  genres?: Genre[];
  vote_count: number;
}

// Represents the properties for a list of TV shows
export interface BaseTVShowListProps {
  shows: BaseTVShowProps[];
  action: (show: BaseTVShowProps) => React.ReactNode;
}

// Represents the properties for a template TV show list page
export interface TemplateTVShowListPageProps extends BaseTVShowListProps {
  name: string;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  isFetching?: boolean;
  totalPages?: number;
}

// Represents the header properties for a TV show
export interface TVShowHeader {
  name: string;
}

// Represents detailed properties of a TV show
export interface TVShowDetailsProps extends BaseTVShowProps {
  genres: Genre[];
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  seasons: {
    season_number: number;
    episode_count: number;
    air_date: string;
  }[];
  episode_run_time?: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  created_by?: any[];
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: {
    id: number;
    name: string;
    vote_average: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  networks?: any[];
  next_episode_to_air?: {
    id: number;
    name: string;
    vote_average: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: string[];
  original_name?: string;
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages?: {
    iso_639_1: string;
    name: string;
  }[];
  status?: string;
  tagline?: string;
  type?: string;
}

// Represents the properties for the filter TV shows card
export interface FilterTVShowsCardProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  language: string;
}

// Represents the response from a discover TV shows API call
export interface DiscoverTVShows {
  page: number;
  total_pages: number;
  total_results: number;
  results: BaseTVShowProps[];
}

// Represents the properties for the TV show filter UI
export interface TVShowFilterUIProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  resetFilters: () => void;
  language: string;
}

// Represents an image associated with a TV show
export interface TVShowImage {
  file_path: string;
  vote_count: number;
}

// General interfaces

// Represents the base properties for media, which can be either a movie or a TV show
export type BaseMediaProps = BaseMovieProps | BaseTVShowProps;

// Represents the properties for the add to favourites icon
export interface AddToFavouritesIconProps {
  type: "movie" | "show";
  media: BaseMediaProps;
}

// Represents a filter with a name, value, condition, and type
export interface Filter {
  name: string;
  value: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  condition: ((item: any, value: string) => boolean) | ((items: any[], value: string) => any[]);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  type?: 'filter' | 'sort';
}

// Represents the properties for a header
export interface HeaderProps {
  title?: string;
  name?: string;
}