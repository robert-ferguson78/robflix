import { Poster } from "../types/interfaces";

// Helper function to fetch data with language parameter
const fetchWithLanguage = (url: string, language: string) => {
  return fetch(`${url}&language=${language}`);
};

// Fetches a list of currently playing movies
export const getMovies = (language: string, page: number = 1) => {
  return fetchWithLanguage(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}&include_adult=false&include_video=false&page=${page}`,
    language
  ).then((response) => {
    if (!response.ok)
      throw new Error(`Unable to fetch movies. Response status: ${response.status}`);
    return response.json();
  })
    .catch((error) => {
      throw error;
    });
};

// Fetches detailed information about a specific movie by ID
export const getMovie = async (id: string, language: string) => {
  console.log("getMovie called with id:", id, "and language:", language); // Log id and language parameters

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&append_to_response=videos`
    );

    if (!response.ok) {
      throw new Error(`Failed to get movie data. Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched movie data:", data); // Log the fetched movie data
    return data;
  } catch (error) {
    console.error("Failed to fetch movie data:", error);
    throw error;
  }
};

// Fetches a list of movie genres
export const getGenres = (language: string) => {
  console.log(`Fetching genres with language: ${language}`);
  
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}`
  ).then((response) => {
    if (!response.ok)
      throw new Error(`Unable to fetch genres. Response status: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    console.log('Fetched genres:', data);
    return data;
  })
  .catch((error) => {
    console.error('Error fetching genres:', error);
    throw error;
  });
};

// Fetches images related to a specific movie by ID
export const getMovieImages = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&include_image_language=en`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("failed to fetch images");
    }
    return response.json();
  }).then((json) => json.posters)
    .catch((error) => {
      throw error
    });
};

// Fetches the featured image for a specific movie by ID
export const getFeaturedMovieImage = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&include_image_language=en`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to fetch images");
      }
      return response.json();
    })
    .then((json) => {
      const posters = json.posters;
      if (posters.length === 0) {
        return null; // Return null if no posters are found
      }
      // Assuming the featured poster is the one with the highest vote count
      const featuredPoster = posters.reduce((prev: Poster, current: Poster) => {
        return (prev.vote_count > current.vote_count) ? prev : current;
      });
      return featuredPoster;
    })
    .catch((error) => {
      throw error;
    });
};

// Fetches reviews for a specific movie by ID
export const getMovieReviews = (id: string | number) => { //movie id can be string or number
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${import.meta.env.VITE_TMDB_KEY}`
  )
    .then((res) => res.json())
    .then((json) => {
      // console.log(json.results);
      return json.results;
    });
};

// Fetches a specific review by review ID
export const getReviewById = (reviewId: string) => {
  return fetch(
    `https://api.themoviedb.org/3/review/${reviewId}?api_key=${import.meta.env.VITE_TMDB_KEY}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to get review data. Response status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    throw error;
  });
};

// Fetches a list of upcoming movies
export const upcomingMovies = async (language: string, page: number = 1) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched upcoming movies data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error);
    throw error;
  }
};

// Fetches a list of popular TV shows
export const fetchPopularTVShows = (language: string, page: number = 1) => {
  return fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&include_adult=false&include_video=false&page=${page}`
  ).then((response) => {
    if (!response.ok)
      throw new Error(`Unable to fetch TV shows. Response status: ${response.status}`);
    return response.json();
  })
    .then((data) => {
      console.log("Fetched TV shows data:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching TV shows:", error);
      throw error;
    });
};

// Fetches detailed information about a specific TV show by ID
export const fetchTVShow = (id: string, language: string) => {
  return fetch(
    `https://api.themoviedb.org/3/discover/tv${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to get TV show data. Response status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    throw error;
  });
};

// Fetches a list of TV shows sorted by vote average
export const getTVShows = (language: string, page: number = 1) => {
  return fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&include_adult=false&include_video=false&page=${page}&sort_by=vote_average.desc`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to get TV show data. Response status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

// Fetches a list of TV show genres
export const getTVGenres = (language: string) => {
  return fetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to get TV show genres. Response status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Fetched TV show genres data api:", data);
    if (!data.genres || data.genres.length === 0) {
      throw new Error("No genres found in the response.");
    }
    return data.genres;
  })
  .catch((error) => {
    console.error("Error fetching TV show genres:", error);
    throw error;
  });
};

// Fetches reviews for a specific TV show by ID
export const getTVShowReviews = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${import.meta.env.VITE_TMDB_KEY}`
  )
    .then((res) => res.json())
    .then((json) => {
      return json.results;
    })
    .catch((error) => {
      throw error;
    });
};

// Fetches detailed information about a specific TV show by ID
export const getTVShow = (id: string, language: string) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}`
  ).then((response) => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`TV show with ID ${id} not found.`);
      }
      throw new Error(`Failed to get TV show data. Response status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    throw error;
  });
};

// Fetches the featured image for a specific TV show by ID
export const getFeaturedTVShowImage = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch TV show details");
      }
      return response.json();
    })
    .then((show) => {
      const filePath = show.poster_path || show.backdrop_path || null;
      return {
        file_path: filePath,
        vote_count: show.vote_count,
      };
    })
    .catch((error) => {
      throw error;
    });
};

// Fetches a list of upcoming TV shows
export const fetchUpcomingTVShows = (language: string, page: number = 1) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/on_the_air?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&page=${page}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming TV shows. Response status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched upcoming TV shows data:", data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

// Searches for movies based on a query string
export const searchMovies = (query: string, language: string, page: number) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&query=${query}&include_adult=false&page=${page}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to get movie data. Response status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    throw error;
  });
};

// Searches for TV shows based on a query string
export const searchTVShows = (query: string, language: string, page: number) => {
  return fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_KEY}&language=${language}&query=${query}&include_adult=false&page=${page}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to get movie data. Response status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    throw error;
  });
};