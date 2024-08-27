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

// Define styles for various components
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

// Define the FilterTVShowsCard component
const FilterTVShowsCard: React.FC<FilterTVShowsCardProps> = ({ titleFilter, genreFilter, sortOption, onUserInput, language }) => {
  // Fetch genres using react-query
  const { data, error, isLoading, isError } = useQuery<Genre[], Error>(["tvGenres", language], () => getTVGenres(language));
  const [sortOptionState, setSortOptionState] = useState<string>(sortOption);

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }
  // Show error message if there's an error
  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  // Prepare genres data
  const genres: Genre[] = Array.isArray(data) ? data : [];
  if (genres.length > 0 && genres[0].name !== "All") {
    genres.unshift({ id: 0, name: "All" });
  }

  // Handle changes in filter options
  const handleChange = (e: SelectChangeEvent, type: FilterOption, value: string) => {
    e.preventDefault();
    onUserInput(type, value);
  };

  // Handle text input change
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e as unknown as SelectChangeEvent, "title", e.target.value);
  };

  // Handle genre selection change
  const handleGenreChange = (e: SelectChangeEvent) => {
    handleChange(e, "genre", e.target.value);
  };

  // Handle sort option change
  const handleSortChange = (e: SelectChangeEvent) => {
    setSortOptionState(e.target.value);
    handleChange(e, "sort", e.target.value);
  };

  return (
    <>
      {/* Filter Card */}
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
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>
      {/* Sort Card */}
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