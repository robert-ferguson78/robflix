import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { User } from "../types/interfaces";

const collectionName = "users";

export const userFirestoreStore = {
    // Function to update a user document with new data
    updateUser: async function(_id: string, newData: User) {
        const userRef = doc(firestore, collectionName, _id); // Use Firestore instance
        await updateDoc(userRef, newData as Partial<User>); // Update the document with new data    
        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

    // Function to add a favourite movie to the user's favourites array
    addFavouriteMovie: async function(_id: string, movieId: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create the document if it does not exist
            await setDoc(userRef, { favourites: [] });
        }

        // Add the movie ID to the favourites array
        await updateDoc(userRef, {
            favourites: arrayUnion(movieId)
        });

        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

    // Function to remove a favourite movie from the user's favourites array
    removeFavouriteMovie: async function(_id: string, movieId: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        // Remove the movie ID from the favourites array
        await updateDoc(userRef, {
            favourites: arrayRemove(movieId)
        });

        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

    // Function to get the favourite movies of a user
    getFavouriteMovies: async function(_id: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        const userData = userDoc.data();
        return userData?.favourites || [];
    },
};