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
import PrivateRoute from './components/privateRoutes';
import { AuthProvider } from './contexts/authContext';

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
      {/* Provide the Auth context to the application */}
      <AuthProvider>
        <BrowserRouter>
          <SiteHeader />
          <MoviesContextProvider>
            <Routes>
              {/* Private routes require authentication */}
              <Route path="/reviews/form" element={<PrivateRoute element={AddMovieReviewPage} />} />
              <Route path="/reviews/:id" element={<PrivateRoute element={MovieReviewPage} />} />
              <Route path="/movies/favourites" element={<PrivateRoute element={FavouriteMoviesPage} />} />
              <Route path="/movies/:id" element={<PrivateRoute element={MoviePage} />} />
              {/* Public routes */}
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