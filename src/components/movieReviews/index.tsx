import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { getMovieReviews } from "../../api/tmdb-api";
import { userFirestoreStore } from "../../models/user-firestore-store"; // Import userFirestoreStore
import { excerpt } from "../../util";
import { MovieDetailsProps, Review } from "../../types/interfaces";
import { auth } from "../../firebase/firebaseConfig"; 

// Define styles for the table
const styles = {
    table: {
        minWidth: 550,
    },
};

// Define the MovieReviews component
const MovieReviews: React.FC<MovieDetailsProps> = (movie) => { 
    // State to store reviews fetched from the API
    const [reviews, setReviews] = useState<Review[]>([]);
    // State to store user reviews fetched from the database
    const [userReviews, setUserReviews] = useState<Review[]>([]);

    useEffect(() => {
        // Fetch reviews from the API
        getMovieReviews(movie.id).then((reviews) => {
            console.log("Fetched reviews:", reviews); // Log the structure of the reviews
            setReviews(reviews);
        });

        // Fetch reviews from the database
        const fetchUserReviews = async () => {
            const userId = auth.currentUser?.uid; // Get the authenticated user's ID
            if (userId) {
                const userReviews = await userFirestoreStore.getReviewsByMovieId(userId, movie.id.toString());
                setUserReviews(userReviews);
            }
        };

        fetchUserReviews();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // Table container for displaying reviews
        <TableContainer component={Paper}>
            <Table sx={styles.table} aria-label="reviews table">
                <TableHead>
                    <TableRow>
                        <TableCell>Author</TableCell>
                        <TableCell align="center">Excerpt</TableCell>
                        <TableCell align="right">More</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Map through the reviews fetched from the API */}
                    {reviews.map((r: Review) => (
                        <TableRow key={r.id}>
                            <TableCell component="th" scope="row">
                                {r.author}
                            </TableCell>
                            <TableCell>{excerpt(r.content)}</TableCell>
                            <TableCell>
                                <Link
                                    to={`/reviews/${r.id}`}
                                    state={{
                                        review: r,
                                        movie: movie,
                                    }}
                                >
                                    Full Review
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* Map through the user reviews fetched from the database */}
                    {userReviews.map((r: Review) => (
                        <TableRow key={r.id}>
                            <TableCell component="th" scope="row">
                                {r.author}
                            </TableCell>
                            <TableCell>{excerpt(r.content)}</TableCell>
                            <TableCell>
                                <Link
                                    to={`/user-reviews/${r.id}`}
                                    state={{
                                        review: r,
                                        movie: movie,
                                    }}
                                >
                                    Full Review
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MovieReviews;