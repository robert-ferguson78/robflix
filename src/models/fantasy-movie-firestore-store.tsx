import { doc, getDoc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

const collectionName = "fantasyMovies";

export const fantasyMovieFirestoreStore = {
    // Function to add a new fantasy movie
    addFantasyMovie: async function(movieData: {
        title: string,
        runtime: number,
        genres: string[],
        production: string,
        releaseDate: string,
        overview: string,
        userUid: string,
        posterUrl: string
    }) {
        const movieRef = await addDoc(collection(firestore, collectionName), movieData);
        const newMovieDoc = await getDoc(movieRef);
        return { id: movieRef.id, ...newMovieDoc.data() };
    },

    // Function to update an existing fantasy movie
    updateFantasyMovie: async function(_id: string, newData: Partial<{
        title: string,
        runtime: number,
        genres: string[],
        production: string,
        releaseDate: string,
        overview: string,
        userUid: string,
        posterUrl: string
    }>) {
        const movieRef = doc(firestore, collectionName, _id);
        await updateDoc(movieRef, newData);
        const updatedDoc = await getDoc(movieRef);
        return updatedDoc.data();
    },

    // Function to get details of a fantasy movie
    getFantasyMovie: async function(_id: string) {
        const movieRef = doc(firestore, collectionName, _id);
        const movieDoc = await getDoc(movieRef);

        if (!movieDoc.exists()) {
            throw new Error("Fantasy movie document does not exist");
        }

        return movieDoc.data();
    },

    // Function to add an actor to the sub-collection
    addActor: async function(movieId: string, actorData: [string, string, string]) {
        const actorsRef = collection(firestore, `${collectionName}/${movieId}/actors`);
        const actorDocRef = await addDoc(actorsRef, {
            name: actorData[0],
            biography: actorData[1],
            profileUrl: actorData[2]
        });
        const newActorDoc = await getDoc(actorDocRef);
        return newActorDoc.data();
    },

    // Function to get actors from the sub-collection
    getActors: async function(movieId: string) {
        const actorsRef = collection(firestore, `${collectionName}/${movieId}/actors`);
        const actorsSnapshot = await getDocs(actorsRef);
        const actorsList = actorsSnapshot.docs.map(doc => doc.data());
        return actorsList;
    },

    // Function to get all fantasy movies
    getAllFantasyMovies: async function() {
        const moviesRef = collection(firestore, collectionName);
        const moviesSnapshot = await getDocs(moviesRef);
        const moviesList = moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return moviesList;
    }
};