import React, { useState, useEffect, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../../images/robflix.png";
import { auth } from '../../firebase/firebaseConfig'; // Import auth
import { signOut } from 'firebase/auth'; // Import signOut from firebase/auth

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

const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const menuOptions = [
    { id: 1, label: "Home", path: "/" },
    { id: 2, label: "Upcoming", path: "/movies/upcoming" },
    { id: 3, label: "Favorites", path: "/movies/favourites" },
    { id: 4, label: "Option 3", path: "/" },
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