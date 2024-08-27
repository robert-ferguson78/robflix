import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TextField, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Define a custom styled button
const CustomButton = styled(Button)({
  color: 'white',
  backgroundColor: 'black',
  border: '1px solid white',
  borderRadius: '5px',
  '&:hover': {
    color: 'black',
    border: '1px solid white',
    backgroundColor: 'white',
  },
});

// Define the SearchPopup component
const SearchPopup: React.FC = () => {
  // State to manage the dialog open/close status
  const [open, setOpen] = useState(false);
  // State to manage the selected tab value
  const [tabValue, setTabValue] = useState(0);
  // State to manage the search query input
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Update the document title and navigate based on the selected tab and search query
      const searchType = tabValue === 0 ? 'movies' : 'tv';
      document.title = `Search ${searchType}`;
      navigate(`/search/${searchType}?query=${encodeURIComponent(searchQuery)}`, { replace: true });
    } else {
      // Reset the document title when the dialog is closed
      document.title = 'Back to search results'; // Replace with your app's default title
    }
  }, [open, tabValue, searchQuery, navigate]);

  // Handle the search button click
  const handleSearch = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Button to open the search dialog */}
      <CustomButton onClick={() => setOpen(true)}>Search</CustomButton>
      {/* Search dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {/* Tabs to switch between movie and TV show search */}
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Movies" />
            <Tab label="TV Shows" />
          </Tabs>
          {/* Text field for search input */}
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search for ${tabValue === 0 ? 'movies' : 'TV shows'}`}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          {/* Button to close the search dialog */}
          <CustomButton onClick={handleSearch} color="primary">Close Search</CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchPopup;