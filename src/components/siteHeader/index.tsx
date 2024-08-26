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

  const menuOptions = [
    { id: 1, label: "Movies", path: "/" },
    { id: 2, label: "Upcoming", path: "/movies/upcoming" },
    { id: 3, label: "Favorites", path: "/movies/favourites" },
    { id: 4, label: "Must Watch", path: "/movies/playlist" },
    { id: 5, label: "Add Fantasy Movie", path: "/movies/fantasy-movie-upload" },
    { id: 6, label: "Fantasy Movies", path: "/movies/fantasy-movies" },
    { id: 7, label: "TV", path: "/tv-shows" },
    { id: 8, label: "Upcoming", path: "/tv-shows/upcoming" },
    { id: 9, label: "Popular TV", path: "/tv-shows/popular" },
    { id: 10, label: "Favorites", path: "/tv-shows/favourites" },
    { id: 11, label: "Must Watch", path: "/tv-shows/playlist" },
  ];

  const handleMenuSelect = (pageURL: string) => {
    navigate(pageURL);
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
                {menuOptions.map((opt) => (
                  <MenuItem
                    key={opt.id}
                    onClick={() => handleMenuSelect(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={isAuthenticated ? handleLogout : () => handleMenuSelect('/login')}>
                  {isAuthenticated ? "Logout" : "Login / Register"}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {menuOptions.map((opt) => (
                <Button
                  key={opt.id}
                  color="inherit"
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </Button>
              ))}
              <CustomButton
                onClick={isAuthenticated ? handleLogout : () => handleMenuSelect('/login')}
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