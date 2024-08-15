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
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
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
  author: string;
  content: string;
  agree: boolean;
  rating: number;
  movieId: number;
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
}

export interface FilterMoviesCardProps {
  onUserInput: (type: string, value: string) => void;
  titleFilter: string;
  genreFilter: string;
  sortOption: string;
}

export interface Poster {
  file_path: string;
  vote_count: number;
}