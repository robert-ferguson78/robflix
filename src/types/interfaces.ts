// Movie interfaces
export interface Genre {
  id: number;
  name: string;
}

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

export interface BaseMovieListProps {
  movies: BaseMovieProps[];
  action: (m: BaseMovieProps) => React.ReactNode;
}

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

export interface MovieImage {
  file_path: string;
  aspect_ratio?: number; // some props are optional...
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface MoviePageProps {
  movie: MovieDetailsProps;
  images: MovieImage[];
}

export type FilterOption = "title" | "genre" | "sort";

export interface MovieListPageTemplateProps extends BaseMovieListProps {
  title: string;
}

export interface GenreData {
  genres: Genre[];
}

export interface DiscoverMovies {
  page: number;
  total_pages: number;
  total_results: number;
  results: BaseMovieProps[];
}

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

export interface AuthContextType {
  currentUser: UserId | null;
}

export interface User {
  uid: string;
  email: string | null;
  favourites: number[];
}

export interface UserId {
  uid: string;
}

export interface PrivateRouteProps {
  element: React.ComponentType; // The component to render if the user is authenticated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional prop types to be passed to the PrivateRoute component
}

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

export interface FantasyMovieCardProps {
  movies: FantasyMovieProps[];
  title?: string;
}

export interface FantasyMovieCardProp {
  movies: FantasyMovieProps;
}

export interface MovieFilterUIProps {
  onFilterValuesChange: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  resetFilters: () => void;
  language: string;
}

export interface FilterMoviesCardProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  language: string;
}

export interface Poster {
  file_path: string;
  vote_count: number;
}

// TV show interfaces

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

export interface BaseTVShowListProps {
  shows: BaseTVShowProps[];
  action: (show: BaseTVShowProps) => React.ReactNode;
}


export interface TemplateTVShowListPageProps extends BaseTVShowListProps {
  name: string;
}

export interface TVShowHeader {
  name: string;
}

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

export interface FilterTVShowsCardProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  language: string;
}

export interface DiscoverTVShows {
  page: number;
  total_pages: number;
  total_results: number;
  results: BaseTVShowProps[];
}

export interface TVShowFilterUIProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
  resetFilters: () => void;
  language: string;
}

export interface TVShowImage {
  file_path: string;
  vote_count: number;
}

// general interfaces

export type BaseMediaProps = BaseMovieProps | BaseTVShowProps;

export interface AddToFavouritesIconProps {
  type: "movie" | "show";
  media: BaseMediaProps;
}

export interface Filter {
  name: string;
  value: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  condition: ((item: any, value: string) => boolean) | ((items: any[], value: string) => any[]);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  type?: 'filter' | 'sort';
}

export interface HeaderProps {
  title?: string;
  name?: string;
}