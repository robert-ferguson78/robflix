import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage";
import PlaylistMoviesPage from "./pages/playlistMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import AddMovieReviewPage from './pages/addMovieReviewPage';
import UpcomingPage from "./pages/upcomingPage";
import AddFantasyMoviePage from "./pages/addFantasyMoviePage";
import FantasyMoviesPage from "./pages/fantasyMoviePage";
import FantasyMovieDetailsPage from "./pages/fantasyMovieDetailsPage";
import SiteHeader from './components/siteHeader';
import MoviesContextProvider from "./contexts/moviesContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from './contexts/authContext';
import withAuth from './hoc/withAuth';

// Wrap components with withAuth HOC (Higher Order Component) to create new components that require authentication
const AddMovieReviewPageWithAuth = withAuth(AddMovieReviewPage);
const MovieReviewPageWithAuth = withAuth(MovieReviewPage);
const FavouriteMoviesPageWithAuth = withAuth(FavouriteMoviesPage);
const PlaylistMoviesPageWithAuth = withAuth(PlaylistMoviesPage);
const AddFantasyMoviePageWithAuth = withAuth(AddFantasyMoviePage);
const FantasyMoviesPageWithAuth = withAuth(FantasyMoviesPage);
const FantasyMovieDetailsPageWithAuth = withAuth(FantasyMovieDetailsPage);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <SiteHeader />
          <MoviesContextProvider>
            <Routes>
              <Route path="/reviews/form/:movieId" element={<AddMovieReviewPageWithAuth />} />
              <Route path="/reviews/:id" element={<MovieReviewPageWithAuth />} />
              <Route path="/movies/favourites" element={<FavouriteMoviesPageWithAuth />} />
              <Route path="/movies/playlist" element={<PlaylistMoviesPageWithAuth />} />
              <Route path="/movies/:id" element={<MoviePage />} />
              <Route path="/movies/fantasy-movie-upload" element={<AddFantasyMoviePageWithAuth />} />
              <Route path="/movies/fantasy-movies" element={<FantasyMoviesPageWithAuth />} />
              <Route path="/movies/fantasy-movies/:id" element={<FantasyMovieDetailsPageWithAuth />} />
              <Route path="/movies/upcoming" element={<UpcomingPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </MoviesContextProvider>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;