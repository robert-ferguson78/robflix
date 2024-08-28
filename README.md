# MovieAPP React App Assignment
Full Stack Development 2, HDip in Computer Science

This repository contains my submission for the Movie assignment which was to the update the Full Stack 2 labs Movie Application.

**Name**: Robert Ferguson 

**Student ID**: 20104121

**Video Demo**: https://youtu.be/KJZ17L65Pk0

**Deployed URL**: https://robflix-peach.vercel.app/

## Features

**Login Page:**
- I used Firebase Authentication for all Login\Sign-Up.
- Users can
  - Login (signInWithEmailAndPassword) with email and password
  - Sign-up (createUserWithEmailAndPassword) with email and password
  - Login\Sign-Up with Google Popup (signInWithPopup).
  - Redirected on sucessfull login to the home page (the movie page is the default home page).

**Home Page:**
- Fetches a list of currently playing movies in Theaters
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.
- Page is paginated (20 movies per page), arrows at top move to next and previous page listings.

**Site Menu:**
- Sub menuu for the site is switched based on the main menu selection of Movies or TV, current page is also highlightde with underline and main menu selection with red background (Movies or TV).
- Language switcher (English, French and German) which is sent in api calls as language parameter globally for all content fetched by API.

**Popup Search**
- Search button in menu opens a popup search box, where user can search for a movie by title and results are upadted in realtime as you type.
- Ability to switch between movie and tv shows search.
- Filter is switched depending on serach type (movie filter for movies and TV filter for TV shows).
- Movies and TV Shows can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.

**Upcoming Movies Page**
- Fetches a list of upcoming movies.
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.
- Page is paginated (20 movies per page), arrows at top move to next and previous page listings.

**Movie Favourites Page**
- Favourites are stored in local storage which is populated by the movie favourites saved in Firebase which adds persistent storage.
- Adding and reomving favourites to local storage also adds and removes from Firebase.
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.

**Movie Must Watch Page**
- Must Watch movies are stored in local storage which is populated by the movie playlist saved in Firebase which adds persistent storage.
- Adding and reomving Must Watch movies to local storage also adds and removes from Firebase.
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.

**Add Fantasy Movie Page**
- Add Movie title, runtime, Gneres, production company, release date, overview, and poster image.
- Add multiple actors to the movie with name, biography and profile image.
- Poster and actor profile image upload preview in form.

**Fantasy Movie Page**
- Lists all fantasy movies created.
- Deatils display for each fantasy movie is title, relase date and more info button to go to fantasy movie details page.

**Tv Page**
- Fetches a list of TV shows sorted by vote average.
- Page is paginated (120 movies per page), arrows at top move to next and previous page listings.
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.

**Tv Upcoming Page**
- Fetches a list of upcoming TV shows.
- Page is paginated (20 movies per page), arrows at top move to next and previous page listings.
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.

**TV Favourites Page**
- Favourites are stored in local storage which is populated by the TV Show favourites saved in Firebase which adds persistent storage.
- Adding and reomving favourites to local storage also adds and removes from Firebase.
- Can be filtered by genre, free text search, and sort by popularity, Alphabetical, release date, ratings highest and lowest.

**TV And Movie Cardse**
- Upadted the design to 4 coulmns with hover effect that displays the movie title and release date, rating and favourite button.

**Movie Detail Page**
- Display fetaured image by vote count.
- Display back button to return to previous page.
- Display movie title, release date, vote average, runtime, genres, overview.
- Display production company logos with production company name and country code as image alt text.
- Dynamic button that display poster art is there are more than 1 poster for film in slider.
- Slider of Youtube trailer videos that load only when they are in view making the page load faster.
- Display of reviews from API and also user reviews from Firebase database.

**TV Detail Page**
- Display fetaured image by vote count.
- Display back button to return to previous page.
- Display movie title, runtime, genres, vote average, overview, first air date.
- Display production company logos with production company name and country code as image alt text.
- Reviews for TV show is not working.

**Adding User Movie Reviews**
- Ability to add user reviews to a movie which is stores in Firebase database for persistent storage.

**Back Button**
- Track browser history for page url and title.
- Back button uses the previous page url saved and title set by the main navigation buttons to give custom button text (Go Back To Movies or TV Shows and more).

## Clone this Repository
<pre>
<code>
git clone <a href="https://github.com/robert-ferguson78/robflix.git" target="_blank">https://github.com/robert-ferguson78/robflix.git</a>
</code>
</pre>
To get a copy of the project running on your system, navigate to the project directory in a command prompt/shell and run the following:
<pre>
<code>
  npm install
</code>
</pre>
This will install all dependencies in package-lock.json

Start the development server:
<pre>
<code>
npm run dev
</code>
</pre>
Build for production:
<pre>
<code>
npm run build
</code>
</pre>
Preview production build:
<pre>
<code>
npm run preview
</code>
</pre>
This will load the application and start a local server on port 3000.
<pre>
<code>
http://localhost:3000/
</code>
</pre>

## Environment Variables for ENV file
- VITE_TMDB_KEY = YOUR_TMDB_API_KEY
- VITE_API_KEY = YOUR_API_KEY
- VITE_AUTH_DOMAIN = YOUR_AUTH_DOMAIN
- VITE_PROJECT_ID = YOUR_PROJECT_ID
- VITE_STORAGE_BUCKET = YOUR_STORAGE_BUCKET
- VITE_MESSAGING_SENDER_ID = YOUR_MESSAGING_SENDER_ID
- VITE_APP_ID = YOUR_APP_ID


## API Endpoints

### Movie Endpoints
- **/movie/now_playing**: Fetches a list of currently playing movies.
- **/movie/{movie_id}**: Fetches detailed information about a specific movie by ID.
- **/genre/movie/list**: Fetches a list of movie genres.
- **/movie/{movie_id}/images**: Fetches images related to a specific movie by ID.
- **/movie/{movie_id}/images**: Fetches the featured image for a specific movie by ID.
- **/movie/{movie_id}/reviews**: Fetches reviews for a specific movie by ID.
- **/review/{review_id}**: Fetches a specific review by review ID.
- **/movie/upcoming**: Fetches a list of upcoming movies.

### TV Show Endpoints
- **/trending/tv/week**: Fetches a list of popular TV shows.
- **/discover/tv/{id}**: Fetches detailed information about a specific TV show by ID.
- **/discover/tv**: Fetches a list of TV shows sorted by vote average.
- **/genre/tv/list**: Fetches a list of TV show genres.
- **/tv/{id}/reviews**: Fetches reviews for a specific TV show by ID.
- **/tv/{id}**: Fetches detailed information about a specific TV show by ID.
- **/tv/{id}**: Fetches the featured image for a specific TV show by ID.
- **/tv/on_the_air**: Fetches a list of upcoming TV shows.

### Search Endpoints
- **/search/movie**: Searches for movies based on a query string.
- **/search/tv**: Searches for TV shows based on a query string.

## Routing

Below are both Public and Protected Routes, along with all routes within them.

### Public Routes

- **/**: Home Page which contains the Movie/TV Show Search.
- **/login**: Login Page.

#### Movies

- **/movies/:id**: Get detailed information about a specific movie.
- **/movies/upcoming**: Get a list of upcoming movies.
- **/movies/fantasy-movies**: Get a list of fantasy movies.
- **/movies/fantasy-movies/:id**: Get detailed information about a specific fantasy movie.

#### TV Shows

- **/tv-shows**: Get a list of TV shows.
- **/tv-shows/:id**: Get detailed information about a specific TV show.
- **/tv-shows/upcoming**: Get a list of upcoming TV shows.
- **/tv-shows/popular**: Get a list of popular TV shows.

#### Reviews

- **/reviews/:id**: Get detailed information about a specific review.
- **/user-reviews/:id**: Get detailed information about a specific user review.

#### Search

- **/search/:type**: Get search results based on the type (movies or TV shows).

### Protected Routes

- **/reviews/form/:movieId**: Add a review for a specific movie (requires authentication).
- **/movies/favourites**: Get a list of favourite movies (requires authentication).
- **/movies/playlist**: Get a list of movies in the playlist (requires authentication).
- **/movies/fantasy-movie-upload**: Upload a fantasy movie (requires authentication).
- **/tv-shows/favourites**: Get a list of favourite TV shows (requires authentication).

## Third Party Components/Integration

**API Integration with TMDB:**
- Pagination Robust integration with TMDb API to fetch detailed information on movies, TV shows, and actors.
- Use of multiple API endpoints to provide users with a rich browsing experience.
- Documentation: https://developer.themoviedb.org/reference/intro/getting-started

**Firebase Backend Services:**
- Firebase Authentication to manage user sign-in and security for protected routes.
- Firebase Storage to store Fantasy Movie Images and Actors Profile Images.
- Firebase Database for retrieval of user-specific data such as Favorites for Movies and TV Shows, playlists which is my Must Watch Movies list.
- Documentation: https://firebase.google.com/docs

**@tanstack/react-query:**
- A powerful data-fetching library for React, providing hooks for fetching, caching, and updating asynchronous data.
- Documentation: [TanStack React Query](https://tanstack.com/query/v4/docs/framework/react/overview)

**React Intersection Observer**
- Description: A React hook to observe when a component enters or leaves the viewport, useful for lazy loading and infinite scrolling.
- Documentation: https://www.npmjs.com/package/react-intersection-observer


**React Slick:**
- Description: A carousel component built with React, providing a flexible and customizable slider.
- Documentation: [React Slick](https://react-slick.neostack.com/)

**slick-carousel:**
- Description: A dependency for react-slick, providing the core carousel functionality.
- Documentation: [Slick Carousel](https://kenwheeler.github.io/slick/)

**Updated Dependencies from Labs:**
- react: Updated from ^18.2.0 to ^18.3.1
- react-dom: Updated from ^18.2.0 to ^18.3.1
- @chromatic-com/storybook: Updated from ^1.4.0 to ^1.6.1
- @storybook/addon-essentials: Updated from ^8.1.3 to ^8.2.5
- @storybook/addon-interactions: Updated from ^8.1.3 to ^8.2.5
- @storybook/addon-links: Updated from ^8.1.3 to ^8.2.5
- @storybook/addon-onboarding: Updated from ^8.1.3 to ^8.2.5
- @storybook/blocks: Updated from ^8.1.3 to ^8.2.5
- @storybook/react: Updated from ^8.1.3 to ^8.2.5
- @storybook/react-vite: Updated from ^8.1.3 to ^8.2.5
- @storybook/test: Updated from ^8.1.3 to ^8.2.5
- storybook: Updated from ^8.1.3 to ^8.2.5

## Independent Learning

Vercel Deployment: https://medium.com/@abdulmuizzayo6/how-to-host-your-react-app-on-vercel-effectively-7ae35b259044 shared in slack channel by Pat.

Firebase Authentication, storage set up with outline of building a React Movie app: https://www.youtube.com/watch?v=2hR-uWjBAgw 

React Udemy courses I bought:
https://www.udemy.com/course/react-the-complete-guide-incl-redux/
https://www.udemy.com/course/react-typescript-the-practical-guide/

List of genres:  https://www.themoviedb.org/talk/644a4b69f794ad04fe3cf1b9

Slicker slider: https://react-slick.neostack.com/docs/get-started

MUI System: https://mui.com/system/getting-started/