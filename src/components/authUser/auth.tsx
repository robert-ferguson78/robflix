import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebaseConfig';
import { TextField, Button, Box, Typography, Card, CardContent, Alert } from '@mui/material';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState<string | null>('logIn');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setErrorMessage(null); // Clear error message on success
            navigate('/');
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setErrorMessage(null); // Clear error message on success
            navigate('/');
        } catch (error) {
            setErrorMessage("Check Credentials and Try again");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setErrorMessage(null);
            navigate('/');
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const handleActionChange = () => {
        setAction(action === 'logIn' ? 'signUp' : 'logIn');
        setErrorMessage(null); // Clear error message when switching actions
    };

    const handleSubmit = async () => {
        if (action === 'logIn') {
            await handleLogin();
        } else {
            await handleSignUp();
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card sx={{ border: '1px solid #eaeaea', boxShadow: 3, mt: 2, maxWidth: 350 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <Typography variant="h4">
                            {action === 'signUp' ? 'Register' : 'Login'}
                        </Typography>
                        {action === 'logIn' && errorMessage && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                margin="normal"
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                            {action === 'signUp' ? 'Register' : 'LogIn'}
                        </Button>
                        <Button variant="text" color="primary" onClick={handleActionChange} sx={{ mt: 2 }}>
                            {action === 'signUp' ? 'Switch to Login' : 'Switch to Register'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleGoogleSignIn} sx={{ mt: 2 }}>
                            Sign in with Google
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};