import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import AddMovieReviewPage from './pages/addMovieReviewPage';
import UpcomingPage from "./pages/upcomingPage";
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
const MoviePageWithAuth = withAuth(MoviePage);

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
              <Route path="/reviews/form" element={<AddMovieReviewPageWithAuth />} />
              <Route path="/reviews/:id" element={<MovieReviewPageWithAuth />} />
              <Route path="/movies/favourites" element={<FavouriteMoviesPageWithAuth />} />
              <Route path="/movies/:id" element={<MoviePageWithAuth />} />
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