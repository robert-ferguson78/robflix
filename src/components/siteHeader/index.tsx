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
import { auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useLanguage } from '../../contexts/languageContext';
import SearchPopup from '../searchPopUp';

// Offset component to handle AppBar offset
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

// Custom styled button
const CustomButton = styled(Button)({
  color: 'white',
  backgroundColor: 'red',
  border: '1px solid red',
  borderRadius: '5px',
  '&:hover': {
    color: 'white',
    border: '1px solid red',
    backgroundColor: 'black',
  },
});

// Custom styled language select dropdown
const LanguageSelect = styled(Select)({
  color: 'white',
  marginRight: '20px',
  '& .MuiSelect-icon': {
    color: 'white',
  },
});

// Main SiteHeader component
const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<'movies' | 'tv'>('movies');
  const [selectedSubMenu, setSelectedSubMenu] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { language, setLanguage } = useLanguage();

  // Effect to handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Effect to update document title based on selected menu and submenu
  useEffect(() => {
    const title = selectedSubMenu
      ? selectedSubMenu.charAt(0).toUpperCase() + selectedSubMenu.slice(1)
      : selectedMenu === 'movies' ? 'Movies' : 'TV Shows';
    document.title = title;
  }, [selectedMenu, selectedSubMenu]);

  // Handle menu item selection
  const handleMenuSelect = (pageURL: string, subMenu: string, customTitle?: string) => {
    navigate(pageURL);
    setSelectedSubMenu(customTitle || subMenu);
    setAnchorEl(null);
  };

  // Handle main menu selection
  const handleMainMenuSelect = (menu: 'movies' | 'tv') => {
    setSelectedMenu(menu);
    setSelectedSubMenu('');
    navigate(menu === 'movies' ? '/' : '/tv-shows');
  };

  // Handle menu button click
  const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  // Render submenu items based on selected main menu
  const renderSubMenu = () => {
    if (selectedMenu === 'movies') {
      return (
        <>
          <MenuItem
            onClick={() => handleMenuSelect("/movies/upcoming", "upcoming", "Upcoming Movies")}
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
            onClick={() => handleMenuSelect("/movies/favourites", "favourites", "Favorite Movies")}
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
            onClick={() => handleMenuSelect("/movies/playlist", "playlist", "Must Watch Movies")}
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
            onClick={() => handleMenuSelect("/movies/fantasy-movie-upload", "fantasy-movie-upload", "Add Fantasy Movie")}
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
            onClick={() => handleMenuSelect("/movies/fantasy-movies", "fantasy-movies", "Fantasy Movies")}
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
            onClick={() => handleMenuSelect("/tv-shows/upcoming", "upcoming", "Upcoming TV Shows")}
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
            onClick={() => handleMenuSelect("/tv-shows/popular", "popular", "Popular TV Shows")}
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
            onClick={() => handleMenuSelect("/tv-shows/favourites", "favourites", "Favorite TV Shows")}
            sx={{
              borderBottom: selectedSubMenu === 'favourites' ? '2px solid red' : 'none',
              '&:hover': {
                borderBottom: '2px solid red',
              },
            }}
          >
            Favorites
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
        {/* Language selection dropdown */}
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
          {/* Logo */}
          <img
            src={logo}
            alt="ROBFLIX"
            style={{ maxWidth: "100px", marginRight: "20px" }}
          />
          {isMobile ? (
            <>
              {/* Mobile menu button */}
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
              {/* Mobile menu items */}
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
              {/* Desktop menu buttons */}
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
              <SearchPopup />
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