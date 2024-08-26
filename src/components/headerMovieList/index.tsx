import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { HeaderPropsWithPagination } from "../../types/interfaces";

const styles = {
    root: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 1.5,
        backgroundColor: "#b90000",
    },
    whiteColour: {
        color: "#ffffff", // Custom color for ArrowForwardIcon
      },
};

const Header: React.FC<HeaderPropsWithPagination> = ({ title, page, setPage, isFetching, totalPages }) => {
    return (
        <Paper component="div" sx={styles.root}>
            {page !== undefined && setPage && isFetching !== undefined && totalPages !== undefined && (
                <>
                    <IconButton
                        aria-label="go back"
                        onClick={() => setPage((old) => Math.max(old - 1, 1))}
                        disabled={page === 1}
                    >
                        <ArrowBackIcon sx={styles.whiteColour} fontSize="large" />
                    </IconButton>
                </>
            )}

            <Typography sx={styles.whiteColour} variant="h4" component="h3">
                {title}
            </Typography>

            {page !== undefined && setPage && isFetching !== undefined && totalPages !== undefined && (
                <>
                    <IconButton
                        aria-label="go forward"
                        onClick={() => {
                            if (!isFetching && page < totalPages) {
                                setPage((old) => old + 1);
                            }
                        }}
                        disabled={isFetching || page >= totalPages}
                    >
                        <ArrowForwardIcon sx={styles.whiteColour} fontSize="large" />
                    </IconButton>
                </>
            )}
        </Paper>
    );
};

export default Header;