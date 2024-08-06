import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

// Function to upload an image to Firebase Storage and return the image URL
export const uploadImage = async (file: File): Promise<string> => {
    try {
        console.log('Starting image upload...');
        const storageRef = ref(storage, `images/${file.name}`);
        console.log('Storage reference created:', storageRef);

        const snapshot = await uploadBytes(storageRef, file);
        console.log('Image uploaded, snapshot:', snapshot);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', downloadURL);

        return downloadURL;
    } catch (error) {
        console.error('Error in uploadImage function:', error);
        throw new Error('Failed to upload image');
    }
};

// Function to delete an image from Firebase Storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) {
        throw new Error("No image URL provided");
    }

    try {
        // Create a reference to the file to delete
        const imageRef = ref(storage, imageUrl);

        // Delete the file
        await deleteObject(imageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
};