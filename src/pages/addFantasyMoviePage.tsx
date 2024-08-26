import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, IconButton, CircularProgress, Snackbar, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, SelectChangeEvent, Container } from '@mui/material';
import { uploadImage } from '../models/storage-firease';
import { fantasyMovieFirestoreStore } from '../models/fantasy-movie-firestore-store';
import { Add as AddIcon, Delete as DeleteIcon, Theaters as TheatersIcon } from '@mui/icons-material';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { styled } from '@mui/system';

const allowedGenres = [
    { id: "0", name: "All" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

type ActorField = 'name' | 'biography' | 'profileFile';

const StyledContainer = styled(Container)({
    backgroundColor: 'white',
    marginTop: '50px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const AddFantasyMoviePage = () => {
    const [title, setTitle] = useState('');
    const [runtime, setRuntime] = useState('');
    const [genres, setGenres] = useState<string[]>([]);
    const [production, setProduction] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [overview, setOverview] = useState('');
    const [posterFile, setPosterFile] = useState<File | undefined>(undefined);
    const [posterPreview, setPosterPreview] = useState<string | undefined>(undefined);
    const [actors, setActors] = useState([{ name: '', biography: '', profileFile: undefined as File | undefined }]);
    const [actorPreviews, setActorPreviews] = useState<(string | undefined)[]>([]);
    const [userUid, setUserUid] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            } else {
                setUserUid(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleActorChange = (index: number, field: ActorField, value: string | File | undefined) => {
        const newActors = [...actors];
        const newActorPreviews = [...actorPreviews];

        if (field === 'profileFile') {
            newActors[index][field] = value as File | undefined;
            newActorPreviews[index] = value ? URL.createObjectURL(value as File) : undefined;
        } else {
            newActors[index][field] = value as string;
        }

        setActors(newActors);
        setActorPreviews(newActorPreviews);
    };

    const handleGenreChange = (event: SelectChangeEvent<string[]>) => {
        setGenres(event.target.value as string[]);
    };

    const handlePosterChange = (file: File | undefined) => {
        setPosterFile(file);
        setPosterPreview(file ? URL.createObjectURL(file) : undefined);
    };

    const addActorField = () => {
        setActors([...actors, { name: '', biography: '', profileFile: undefined }]);
        setActorPreviews([...actorPreviews, undefined]);
    };

    const removeActorField = (index: number) => {
        const newActors = actors.filter((_, i) => i !== index);
        const newActorPreviews = actorPreviews.filter((_, i) => i !== index);
        setActors(newActors);
        setActorPreviews(newActorPreviews);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
    
        // Check required fields
        if (!title || !runtime || genres.length === 0 || !production || !releaseDate || !overview || !userUid) {
            alert('Please fill out all required fields.');
            setLoading(false);
            return;
        }
    
        try {
            console.log('Starting to upload poster image...');
            // Upload the poster image
            let posterUrl = '';
            if (posterFile) {
                try {
                    posterUrl = await uploadImage(posterFile);
                    console.log('Poster image uploaded successfully:', posterUrl);
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    alert('Failed to upload poster image. Please try again.');
                    setLoading(false);
                    return;
                }
            }
    
            console.log('Preparing movie data...');
            // Save the movie details to Firestore
            const movieData = {
                title,
                runtime: Number(runtime),
                genres,
                production,
                releaseDate,
                overview,
                userUid,
                posterUrl
            };
            console.log('Movie data:', movieData);
    
            const movieRef = await fantasyMovieFirestoreStore.addFantasyMovie(movieData);
            const movie = { id: movieRef.id, ...movieData };
            console.log('Movie added successfully:', movie);
    
            // Ensure movie.id is valid
            if (!movie.id) {
                console.error('Movie ID is undefined. Cannot add actors.');
                alert('Failed to add movie. Please try again.');
                setLoading(false);
                return;
            }
            
            // Save the actor information to the sub-collection
            for (const actor of actors) {
                if (actor.name && actor.biography && actor.profileFile) {
                    console.log('Adding actor:', actor);
                    try {
                        const profileUrl = await uploadImage(actor.profileFile);
                        await fantasyMovieFirestoreStore.addActor(movie.id, [
                            actor.name,
                            actor.biography,
                            profileUrl,
                        ]);
                        console.log('Actor added successfully:', actor);
                    } catch (error) {
                        console.error('Error adding actor:', actor, error);
                        alert(`Failed to add actor: ${actor.name}. Please try again.`);
                    }
                } else {
                    console.warn('Skipping actor with incomplete data:', actor);
                }
            }
            
            // Clear the form
            console.log('Clearing the form...');
            setTitle('');
            setRuntime('');
            setGenres([]);
            setProduction('');
            setReleaseDate('');
            setOverview('');
            setPosterFile(undefined);
            setPosterPreview(undefined);
            setActors([{ name: '', biography: '', profileFile: undefined }]);
            setActorPreviews([undefined]);
            
            setSuccessMessage('Fantasy movie and actor information added successfully!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (error) {
            console.error('Error adding fantasy movie:', error);
            alert('Failed to add fantasy movie. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledContainer maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Add Fantasy Movie
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Runtime (minutes)"
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="genre-label">Genres</InputLabel>
                    <Select
                    labelId="genre-label"
                    id="genre-select"
                    multiple
                    value={genres}
                    onChange={handleGenreChange}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                >
                    {allowedGenres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.name}>
                            <Checkbox checked={genres.indexOf(genre.name) > -1} />
                            <ListItemText primary={genre.name} />
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Production"
                    value={production}
                    onChange={(e) => setProduction(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Release Date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Overview"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                />
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Upload Poster
                    <input
                        type="file"
                        hidden
                        onChange={(e) => handlePosterChange(e.target.files ? e.target.files[0] : undefined)}
                    />
                </Button>
                {posterPreview && (
                    <Box sx={{ mt: 2 }}>
                        <img src={posterPreview} alt="Poster Preview" style={{ width: '100%' }} />
                    </Box>
                )}
                <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 1 }}>
                    Add Actor Information
                </Typography>
                {actors.map((actor, index) => (
                    <Box key={index} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Actor Name"
                            value={actor.name}
                            onChange={(e) => handleActorChange(index, 'name', e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Actor Biography"
                            multiline
                            rows={4}
                            value={actor.biography}
                            onChange={(e) => handleActorChange(index, 'biography', e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Upload Profile Image
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleActorChange(index, 'profileFile', e.target.files ? e.target.files[0] : undefined)}
                            />
                        </Button>
                        {actorPreviews[index] && (
                            <Box sx={{ mt: 2 }}>
                                <img src={actorPreviews[index]} alt="Actor Profile Preview" style={{ width: '100%' }} />
                            </Box>
                        )}
                        <IconButton onClick={() => removeActorField(index)} disabled={actors.length === 1} sx={{ mt: 1 }}>
                            <DeleteIcon /> Remove Actor
                        </IconButton>
                    </Box>
                ))}
                <Button
                    variant="contained"
                    onClick={addActorField}
                    fullWidth
                    sx={{ mt: 2 }}
                    startIcon={<AddIcon />}
                >
                    Add Another Actor
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                    startIcon={<TheatersIcon />}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add Fantasy Movie'}
                </Button>
            </Box>
            <Snackbar
                open={!!successMessage}
                message={successMessage}
                autoHideDuration={2000}
                onClose={() => setSuccessMessage('')}
            />
        </StyledContainer>
    );
};

export default AddFantasyMoviePage;