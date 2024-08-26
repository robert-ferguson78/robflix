import type { Meta, StoryObj } from '@storybook/react';
import MovieListHeader from "../components/headerMovieList";
import { MemoryRouter } from "react-router";
import MoviesContextProvider from "../contexts/moviesContext";
import { LanguageProvider } from '../contexts/languageContext';

const meta = {
  title: 'Home Page/Header',
  component: MovieListHeader,
  decorators: [
    (Story) => (
      <LanguageProvider>
        <MoviesContextProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Story />
          </MemoryRouter>
        </MoviesContextProvider>
      </LanguageProvider>
    ),
  ],
} satisfies Meta<typeof MovieListHeader>;

export default meta;

type Story = StoryObj<typeof MovieListHeader>;

export const Basic: Story = {
  args: { title: 'Discover Movies' }
};

Basic.storyName = "Default";