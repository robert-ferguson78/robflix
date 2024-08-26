import React from 'react';
import { Story, Meta } from '@storybook/react';
import MovieCard from '../components/movieCard';
import { MoviesContext } from '../contexts/moviesContext';
import sampleData from './sampleData';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/MovieCard',
  component: MovieCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story = (args) => <MovieCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  movie: sampleData,
  action: () => <></>,
};

export const Favorite = Template.bind({});
Favorite.args = {
  ...Default.args,
};
Favorite.decorators = [
  (Story) => (
    <MoviesContext.Provider
      value={{
        favourites: [sampleData.id],
        addToFavourites: () => {},
        mustPlaylist: [],
        movies: [],
        genres: [],
        removeFromFavourites: () => {},
        addToPlaylist: () => {},
        removeFromPlaylist: () => {},
        addReview: () => {},
        setMustPlaylist: () => {},
        setFavourites: () => {},
      }}
    >
      <Story />
    </MoviesContext.Provider>
  ),
];

export const WithAction = Template.bind({});
WithAction.args = {
  ...Default.args,
  action: (movie) => (
    <button onClick={() => console.log(`Added ${movie.title} to favorites`)}>
      Add to Favorites
    </button>
  ),
};