import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationHistoryContext } from "../../contexts/navigationHistoryContext";
import Button from "@mui/material/Button";

// Define the GoBackButton component
const GoBackButton: React.FC = () => {
  const navigate = useNavigate();
  const history = useNavigationHistoryContext();

  // Determine the previous page from the navigation history
  const previousPage = history.length > 1 ? history[history.length - 2] : null;
  const previousPageTitle = previousPage ? previousPage.title : "Previous Page";

  return (
    // Render a button that navigates back to the previous page
    <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
      Back {previousPageTitle}
    </Button>
  );
};

export default GoBackButton;