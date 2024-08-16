import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { User } from "../types/interfaces";

const collectionName = "users";

export const userFirestoreStore = {

// User DB calls

    // Function to update a user document with new data
    updateUser: async function(_id: string, newData: User) {
        const userRef = doc(firestore, collectionName, _id); // Use Firestore instance
        await updateDoc(userRef, newData as Partial<User>); // Update the document with new data    
        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

// Movies DB calls

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

    // Function to add a favourite TV show to the user's tvfavourites array
    addFavouriteTVShow: async function(_id: string, showId: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create the document if it does not exist
            await setDoc(userRef, { tvfavourites: [] });
        }

        // Add the show ID to the tvfavourites array
        await updateDoc(userRef, {
            tvfavourites: arrayUnion(showId)
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

    // Function to add a movie to the user's watchList array
    addWatchListMovie: async function(_id: string, movieId: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create the document if it does not exist
            await setDoc(userRef, { watchList: [] });
        }

        // Add the movie ID to the watchList array
        await updateDoc(userRef, {
            watchList: arrayUnion(movieId)
        });

        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

    // Function to remove a movie from the user's watchList array
    removeWatchListMovie: async function(_id: string, movieId: string) {
        console.log(`Removing movie with ID: ${movieId} from user with ID: ${_id}`);
        
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        // Remove the movie ID from the watchList array
        await updateDoc(userRef, {
            watchList: arrayRemove(movieId)
        });

        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

    // Function to get the watchList movies of a user
    getWatchListMovies: async function(_id: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        return userDoc.data()?.watchList || [];
    },

// TV Shows DB calls

    // Function to update a favourite TV show in the user's tvfavourites array
    updateFavouriteTVShow: async function(_id: string, oldShowId: string, newShowId: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        // Remove the old show ID and add the new show ID to the tvfavourites array
        await updateDoc(userRef, {
            tvfavourites: arrayRemove(oldShowId)
        });

        await updateDoc(userRef, {
            tvfavourites: arrayUnion(newShowId)
        });

        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },

    // Function to remove a favourite TV show from the user's tvfavourites array
    removeFavouriteTVShow: async function(_id: string, showId: string) {
        const userRef = doc(firestore, collectionName, _id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }

        // Remove the show ID from the tvfavourites array
        await updateDoc(userRef, {
            tvfavourites: arrayRemove(showId)
        });

        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    },
};