import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage";
import FavouriteTVPage from "./pages/favouriteTVPage";
import PlaylistMoviesPage from "./pages/playlistMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import AddMovieReviewPage from './pages/addMovieReviewPage';
import UpcomingPage from "./pages/upcomingPage";
import UpcomingTVPage from "./pages/tvShowsUpcomingPage";
import PopularTVPage from "./pages/tvShowsPopularPage";
import AddFantasyMoviePage from "./pages/addFantasyMoviePage";
import FantasyMoviesPage from "./pages/fantasyMoviePage";
import FantasyMovieDetailsPage from "./pages/fantasyMovieDetailsPage";
import TVShowsPage from "./pages/tvShowsPage";
import TVPage from "./pages/tvShowDetailsPage";
import SiteHeader from './components/siteHeader';
import MoviesContextProvider from "./contexts/moviesContext";
import { NavigationHistoryProvider } from "./contexts/navigationHistoryContext";
import TVShowsContextProvider from "./contexts/tvShowsContext";
import { LanguageProvider } from "./contexts/languageContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from './contexts/authContext';
import withAuth from './hoc/withAuth';
import SearchResultsPage from './pages/searchResultsPage';

// Wrap components with withAuth HOC (Higher Order Component) to create new components that require authentication
const AddMovieReviewPageWithAuth = withAuth(AddMovieReviewPage);
const MovieReviewPageWithAuth = withAuth(MovieReviewPage);
const FavouriteMoviesPageWithAuth = withAuth(FavouriteMoviesPage);
const FavouriteTVPageWithAuth = withAuth(FavouriteTVPage);
const PlaylistMoviesPageWithAuth = withAuth(PlaylistMoviesPage);
const AddFantasyMoviePageWithAuth = withAuth(AddFantasyMoviePage);
const FantasyMoviesPageWithAuth = withAuth(FantasyMoviesPage);
const FantasyMovieDetailsPageWithAuth = withAuth(FantasyMovieDetailsPage);

// Create a new QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000, // Data is considered stale after 6 minutes
      refetchInterval: 360000, // Refetch data every 6 minutes
      refetchOnWindowFocus: false // Do not refetch on window focus
    },
  },
});

// Main App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> {/* Provide authentication context */}
      <LanguageProvider> {/* Provide language context */}
        <BrowserRouter> {/* Enable routing */}
        <NavigationHistoryProvider> {/* Provide navigation history context */}
          <SiteHeader /> {/* Render the site header */}
            <MoviesContextProvider> {/* Provide movies context */}
              <TVShowsContextProvider> {/* Provide TV shows context */}
                <Routes> {/* Define application routes */}
                  <Route path="/reviews/form/:movieId" element={<AddMovieReviewPageWithAuth />} />
                  <Route path="/reviews/:id" element={<MovieReviewPageWithAuth />} />
                  <Route path="/user-reviews/:id" element={<MovieReviewPageWithAuth />} />
                  <Route path="/movies/favourites" element={<FavouriteMoviesPageWithAuth />} />
                  <Route path="/movies/playlist" element={<PlaylistMoviesPageWithAuth />} />
                  <Route path="/movies/:id" element={<MoviePage />} />
                  <Route path="/movies/fantasy-movie-upload" element={<AddFantasyMoviePageWithAuth />} />
                  <Route path="/movies/fantasy-movies" element={<FantasyMoviesPageWithAuth />} />
                  <Route path="/movies/fantasy-movies/:id" element={<FantasyMovieDetailsPageWithAuth />} />
                  <Route path="/movies/upcoming" element={<UpcomingPage />} />
                  <Route path="/tv-shows/upcoming" element={<UpcomingTVPage />} />
                  <Route path="/tv-shows/favourites" element={<FavouriteTVPageWithAuth />} />
                  <Route path="/tv-shows/popular" element={<PopularTVPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tv-shows" element={<TVShowsPage />} />
                  <Route path="/tv-shows/:id" element={<TVPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/search/:type" element={<SearchResultsPage />} />
                </Routes>
              </TVShowsContextProvider>
            </MoviesContextProvider>
          </NavigationHistoryProvider>
        </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} /> {/* React Query Devtools */}
    </QueryClientProvider>
  );
};

export default App;