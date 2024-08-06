import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, CircularProgress, Snackbar } from '@mui/material';
import { uploadImage } from '../models/storage-firease';
import { fantasyMovieFirestoreStore } from '../models/fantasy-movie-firestore-store';
import { Add as AddIcon, Delete as DeleteIcon, Theaters as TheatersIcon } from '@mui/icons-material';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const AddFantasyMoviePage = () => {
    const [title, setTitle] = useState('');
    const [runtime, setRuntime] = useState('');
    const [genres, setGenres] = useState('');
    const [production, setProduction] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [overview, setOverview] = useState('');
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [actors, setActors] = useState([{ name: '', biography: '', profileFile: null as File | null }]);
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

    const handleActorChange = (index: number, field: string, value: any) => {
        const newActors = [...actors];
        newActors[index][field] = value;
        setActors(newActors);
    };

    const addActorField = () => {
        setActors([...actors, { name: '', biography: '', profileFile: null }]);
    };

    const removeActorField = (index: number) => {
        const newActors = actors.filter((_, i) => i !== index);
        setActors(newActors);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
    
        // Check required fields
        if (!title || !runtime || !genres || !production || !releaseDate || !overview || !userUid) {
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
                genres: genres.split(',').map(genre => genre.trim()),
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
            setGenres('');
            setProduction('');
            setReleaseDate('');
            setOverview('');
            setPosterFile(null);
            setActors([{ name: '', biography: '', profileFile: null }]);
            
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
        <Container maxWidth="sm">
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
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Genres (comma separated)"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                />
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
                        onChange={(e) => setPosterFile(e.target.files ? e.target.files[0] : null)}
                    />
                </Button>
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
                                onChange={(e) => handleActorChange(index, 'profileFile', e.target.files ? e.target.files[0] : null)}
                            />
                        </Button>
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
        </Container>
    );
};

export default AddFantasyMoviePage;