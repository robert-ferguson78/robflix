import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationHistoryContext } from "../../contexts/navigationHistoryContext";
import Button from "@mui/material/Button";

const GoBackButton: React.FC = () => {
  const navigate = useNavigate();
  const history = useNavigationHistoryContext();

  const previousPage = history.length > 1 ? history[history.length - 2] : null;
  const previousPageTitle = previousPage ? previousPage.title : "Previous Page";

  return (
    <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
      Back {previousPageTitle}
    </Button>
  );
};

export default GoBackButton;