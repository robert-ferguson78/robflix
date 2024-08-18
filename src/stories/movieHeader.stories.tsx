import type { Meta, StoryObj } from '@storybook/react';
import MovieHeader from "../components/headerMovie";
import SampleMovie from "./sampleData";
import { MemoryRouter } from "react-router";

import React from 'react';

const meta = {
    title: "Movie Details Page/MovieHeader",
    component: MovieHeader,
    decorators: [
        (Story: React.FC) => <MemoryRouter initialEntries={["/"]}><Story /></MemoryRouter>,
    ],
} satisfies Meta<typeof MovieHeader>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Basic: Story = {
    args: {
        title: SampleMovie.title,
        budget: SampleMovie.budget,
        homepage: SampleMovie.homepage,
        id: SampleMovie.id,
        imdb_id: SampleMovie.imdb_id,
        original_language: SampleMovie.original_language,
        overview: SampleMovie.overview,
        release_date: SampleMovie.release_date,
        vote_average: SampleMovie.vote_average,
        popularity: SampleMovie.popularity,
        poster_path: SampleMovie.poster_path,
        tagline: SampleMovie.tagline,
        runtime: SampleMovie.runtime,
        revenue: SampleMovie.revenue,
        vote_count: SampleMovie.vote_count,
        genre_ids: SampleMovie.genre_ids,
        genres: SampleMovie.genres,
        production_countries: SampleMovie.production_countries,
        production_companies: SampleMovie.production_companies,
        adult: SampleMovie.adult,
        backdrop_path: SampleMovie.backdrop_path,
        belongs_to_collection: SampleMovie.belongs_to_collection,
    }
};
Basic.storyName = "Default";