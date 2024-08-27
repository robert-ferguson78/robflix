import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TextField, Dialog, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

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

const SearchPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const searchType = tabValue === 0 ? 'movies' : 'tv';
      document.title = `Search ${searchType}`;
      navigate(`/search/${searchType}?query=${encodeURIComponent(searchQuery)}`, { replace: true });
    } else {
      document.title = 'Back to search results'; // Replace with your app's default title
    }
  }, [open, tabValue, searchQuery, navigate]);

  const handleSearch = () => {
    setOpen(false);
  };

  return (
    <>
      <CustomButton onClick={() => setOpen(true)}>Search</CustomButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Movies" />
            <Tab label="TV Shows" />
          </Tabs>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search for ${tabValue === 0 ? 'movies' : 'TV shows'}`}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleSearch} color="primary">Close Search</CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchPopup;