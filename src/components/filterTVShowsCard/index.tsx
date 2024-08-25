import React, { ChangeEvent, useState } from "react";
import { FilterOption, Genre, FilterTVShowsCardProps } from "../../types/interfaces";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getTVGenres } from "../../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from '../spinner';

const styles = {
  root: {
    maxWidth: 345,
  },
  media: { height: 300 },
  formControl: {
    margin: 1,
    minWidth: 220,
    backgroundColor: "rgb(255, 255, 255)",
  },
};

const FilterTVShowsCard: React.FC<FilterTVShowsCardProps> = ({ titleFilter, genreFilter, sortOption, onUserInput, language }) => {
  console.log(`Language prop tv show card: ${language}`); // Debugging log

  const { data, error, isLoading, isError } = useQuery<Genre[], Error>(["genres", language], () => getTVGenres(language), {
    onSuccess: (data) => {
      console.log("Raw data from API:", data); // Log raw data
    },
    onError: (error) => {
      console.error("Error fetching genres:", error); // Log any errors
    }
  });
  const [sortOptionState, setSortOptionState] = useState<string>(sortOption);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }
  console.log("Data before assigning to genres:", data);
  const genres: Genre[] = data || [];
  console.log("Fetched genres:", genres); // Log the genres
  if (genres.length > 0 && genres[0].name !== "All") {
    genres.unshift({ id: 0, name: "All" });
  }

  console.log("Fetched genres:", genres); // Log the genres

  const handleChange = (e: SelectChangeEvent, type: FilterOption, value: string) => {
    e.preventDefault();
    onUserInput(type, value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e as unknown as SelectChangeEvent, "title", e.target.value);
  };

  const handleGenreChange = (e: SelectChangeEvent) => {
    handleChange(e, "genre", e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent) => {
    setSortOptionState(e.target.value);
    handleChange(e, "sort", e.target.value);
    console.log("Sort option selected:", e.target.value); // Debugging log
  };

  return (
    <>
      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <FilterAltIcon fontSize="large" />
            Filter the TV shows.
          </Typography>
          <TextField
            sx={styles.formControl}
            id="filled-search"
            label="Search field"
            type="search"
            value={titleFilter}
            variant="filled"
            onChange={handleTextChange}
          />
          <FormControl sx={styles.formControl}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              {genres.map((genre) => {
                return (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </CardContent>
      </Card>
      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <SortIcon fontSize="large" />
            Sort the TV shows.
          </Typography>
          <FormControl sx={styles.formControl}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              id="sort-select"
              value={sortOptionState}
              onChange={handleSortChange}
            >
              <MenuItem value="name">A-Z</MenuItem>
              <MenuItem value="highRating">Rating High</MenuItem>
              <MenuItem value="lowRating">Rating Low</MenuItem>
              <MenuItem value="releaseDate">Release Date</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </>
  );
};

export default FilterTVShowsCard;