import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebaseConfig';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState<string | null>(null);

    const handleSignUp = async () => {
        setAction('signUp');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const handleLogin = async () => {
        setAction('logIn');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User logged out');
            setAction('logOut');
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    return (
        <div>
            <h1>Authentication login test</h1>
            {action === 'signUp' && <h4>Sign up for account</h4>}
            {action === 'logIn' && <h4>Login to account</h4>}
            {action === 'logOut' && <h4>You have logged out sucessfully</h4>}
            {action && (
                <>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </>
            )}
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleLogin}>Log In</button>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
            <button onClick={handleLogout}>Logout current user</button>
        </div>
    );
};