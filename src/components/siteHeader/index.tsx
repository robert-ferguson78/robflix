import React, { useState, useEffect, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Select from '@mui/material/Select';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../../images/robflix.png";
import { auth } from '../../firebase/firebaseConfig'; // Import auth
import { signOut } from 'firebase/auth'; // Import signOut from firebase/auth
import { useLanguage } from '../../contexts/languageContext';

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const CustomButton = styled(Button)({
  color: 'black',
  backgroundColor: 'red',
  border: '1px solid red',
  borderRadius: '5px',
  '&:hover': {
    color: 'white',
    border: '1px solid red',
    backgroundColor: 'black',
  },
});

const LanguageSelect = styled(Select)({
  color: 'white',
  marginRight: '20px',
  '& .MuiSelect-icon': {
    color: 'white',
  },
});

const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<'movies' | 'tv'>('movies');
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuSelect = (pageURL: string, subMenu: string) => {
    navigate(pageURL);
    setSelectedSubMenu(subMenu);
    setAnchorEl(null);
  };

  const handleMainMenuSelect = (menu: 'movies' | 'tv') => {
    setSelectedMenu(menu);
    setSelectedSubMenu('');
    navigate(menu === 'movies' ? '/' : '/tv-shows');
  };

  const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const renderSubMenu = () => {
    if (selectedMenu === 'movies') {
      return (
        <>
          <MenuItem
            onClick={() => handleMenuSelect("/movies/upcoming", "upcoming")}
            sx={{
              borderBottom: selectedSubMenu === 'upcoming' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Upcoming
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/movies/favourites", "favourites")}
            sx={{
              borderBottom: selectedSubMenu === 'favourites' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Favorites
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/movies/playlist", "playlist")}
            sx={{
              borderBottom: selectedSubMenu === 'playlist' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Must Watch
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/movies/fantasy-movie-upload", "fantasy-movie-upload")}
            sx={{
              borderBottom: selectedSubMenu === 'fantasy-movie-upload' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Add Fantasy Movie
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/movies/fantasy-movies", "fantasy-movies")}
            sx={{
              borderBottom: selectedSubMenu === 'fantasy-movies' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Fantasy Movies
          </MenuItem>
        </>
      );
    } else if (selectedMenu === 'tv') {
      return (
        <>
          <MenuItem
            onClick={() => handleMenuSelect("/tv-shows/upcoming", "upcoming")}
            sx={{
              borderBottom: selectedSubMenu === 'upcoming' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Upcoming
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/tv-shows/popular", "popular")}
            sx={{
              borderBottom: selectedSubMenu === 'popular' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Popular TV
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/tv-shows/favourites", "favourites")}
            sx={{
              borderBottom: selectedSubMenu === 'favourites' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Favorites
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("/tv-shows/playlist", "playlist")}
            sx={{
              borderBottom: selectedSubMenu === 'playlist' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Must Watch
          </MenuItem>
        </>
      );
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: "rgb(20, 20, 20)" }}
      >
        <LanguageSelect
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'de')}
          sx={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
        </LanguageSelect>
        <Toolbar sx={{ maxWidth: "1100px", width: "100%", margin: "0 auto" }}>
          <img
            src={logo}
            alt="ROBFLIX"
            style={{ maxWidth: "100px", marginRight: "20px" }}
          />
          {isMobile ? (
            <>
              <IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                size="large"
                sx={{ marginLeft: "auto" }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => handleMainMenuSelect('movies')}>Movies</MenuItem>
                <MenuItem onClick={() => handleMainMenuSelect('tv')}>TV</MenuItem>
                {renderSubMenu()}
                <MenuItem onClick={isAuthenticated ? handleLogout : () => handleMenuSelect('/login', '')}>
                  {isAuthenticated ? "Logout" : "Login / Register"}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => handleMainMenuSelect('movies')}
                sx={{
                  backgroundColor: selectedMenu === 'movies' ? 'red' : 'transparent',
                  color: selectedMenu === 'movies' ? 'white' : 'inherit',
                  borderBottom: selectedMenu === 'movies' ? '2px solid red' : 'none',
                  '&:hover': {
                    backgroundColor: selectedMenu === 'movies' ? 'darkred' : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Movies
              </Button>
              <Button
                color="inherit"
                onClick={() => handleMainMenuSelect('tv')}
                sx={{
                  backgroundColor: selectedMenu === 'tv' ? 'red' : 'transparent',
                  color: selectedMenu === 'tv' ? 'white' : 'inherit',
                  borderBottom: selectedMenu === 'tv' ? '2px solid red' : 'none',
                  '&:hover': {
                    backgroundColor: selectedMenu === 'tv' ? 'darkred' : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                TV
              </Button>
              <div style={{ display: 'flex', marginLeft: '20px' }}>
                {renderSubMenu()}
              </div>
              <CustomButton
                onClick={isAuthenticated ? handleLogout : () => handleMenuSelect('/login', '')}
                sx={{ marginLeft: "auto" }}
              >
                {isAuthenticated ? "Logout" : "Login / Register"}
              </CustomButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;