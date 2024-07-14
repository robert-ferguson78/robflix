import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Navigate, Routes, Link } from "react-router-dom";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import AddMovieReviewPage from './pages/addMovieReviewPage';
import UpcomingPage from "./pages/upcomingPage";
import SiteHeader from './components/siteHeader'
import MoviesContextProvider from "./contexts/moviesContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';

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
    <BrowserRouter>
      <SiteHeader />
      <MoviesContextProvider>
        <Routes>
          <Route path="/reviews/form" element={<AddMovieReviewPage/>} />
          <Route path="/reviews/:id" element={<MovieReviewPage/>} />
          <Route path="/movies/favourites" element={<FavouriteMoviesPage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/movies/upcoming" element={<UpcomingPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MoviesContextProvider>
    </BrowserRouter>
  <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)