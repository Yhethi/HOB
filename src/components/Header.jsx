import React, { useEffect } from "react";
import {
  styled,
  alpha,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
// Icons
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import { getProductFilter } from "../redux/slices/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDarkMode } from "../js/changeColor";
import { toggleSidebar } from "../redux/slices/sidebarSlice";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";
import { setIsLoading } from "../redux/slices/loaderSlice";
import useAuth from "../../middleware/useAuth";
import { darkModeActived } from "../redux/slices/darkModeSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const getSidebarStatus = useSelector((state) => state.sidebar.isOpen);

  // Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("isDarkMode")) || false
  );

  const togglePrimaryColor = () => {
    const newTheme = !isDarkMode;
    getDarkMode(isDarkMode);
    setIsDarkMode(newTheme);
    dispatch(darkModeActived(isDarkMode));
    localStorage.setItem("isDarkMode", JSON.stringify(newTheme));
  };

  useEffect(() => {
    getDarkMode(!isDarkMode);
  }, []);

  // const toggleShowCart = () => {
  //   dispatch(setShowCart(!showCart));
  // };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearch = (e) => {
    dispatch(getProductFilter(e.target.value));
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar(!getSidebarStatus));
  };

  const handleGoTo = (url) => {
    navigate(url);
  };

  const handleLogout = () => {
    dispatch(setIsLoading(true));
    dispatch(logoutUser());
    localStorage.setItem("cartItems", JSON.stringify([]));
    handleGoTo("/");
    setTimeout(() => {
      dispatch(setIsLoading(false));
      document.body.click();
    }, 1000);
  };

  const handleCloseCartIfMobile = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth <= 768) {
      dispatch(setShowCart(false));
    }
  };

  const isLogged = useAuth();

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "primary.main",
        },
      }}
    >
      {!isLogged && (
        <MenuItem
          onClick={() => {
            handleGoTo("/login");
          }}
        >
          Iniciar Sesion
        </MenuItem>
      )}
      {!isLogged && (
        <MenuItem
          onClick={() => {
            handleGoTo("/register");
          }}
        >
          Registrarse
        </MenuItem>
      )}
      {/* {isLogged && (
        <MenuItem
          onClick={() => {
            handleGoTo("/perfil");
          }}
        >
          My account
        </MenuItem>
      )} */}
      {isLogged && <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>}
      {/* <MenuItem
        onClick={() => {
          handleGoTo("/perfil/1");
        }}
      >
        Profile
      </MenuItem> */}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "primary.main",
        },
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={togglePrimaryColor}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={isDarkMode ? "on" : "off"} color="error">
            <DarkModeIcon />
          </Badge>
        </IconButton>
        <p>Modo Oscuro</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Perfil</p>
      </MenuItem>
    </Menu>
  );

  // Tema claro
  const lightTheme = createTheme({
    palette: {
      primary: {
        main: "#ffffff", // Color para el AppBar en tema claro
      },
      text: {
        primary: "#000000", // Color del texto en tema claro
      },
    },
  });

  // Tema oscuro
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#242424", // Color para el AppBar en tema oscuro
      },
      text: {
        primary: "#ffffff", // Color del texto en tema oscuro
      },
    },
  });

  return (
    <>
      <div className="header__component">
        <Sidebar />
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar className="appBar" position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  onClick={handleToggleSidebar}
                >
                  <MenuIcon />
                </IconButton>

                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    navigate("/");
                    handleCloseCartIfMobile();
                  }}
                >
                  <HomeIcon />
                </IconButton>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    className="input__search"
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleSearch}
                    onClick={handleCloseCartIfMobile}
                  />
                </Search>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={togglePrimaryColor}
                  >
                    <Badge
                      badgeContent={isDarkMode ? "on" : "off"}
                      color="error"
                    >
                      <DarkModeIcon />
                    </Badge>
                  </IconButton>
                  {/* <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton> */}
                  {/* <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={toggleShowCart}
                    className={`cart-button ${isPulsing ? "pulse" : ""}`}
                  >
                    <Badge badgeContent={totalItems} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton> */}
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </Box>
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  {/* <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={toggleShowCart}
                    className={`cart-button ${isPulsing ? "pulse" : ""}`}
                  >
                    <Badge badgeContent={totalItems} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton> */}
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={togglePrimaryColor}
                  >
                    <Badge
                      badgeContent={isDarkMode ? "on" : "off"}
                      color="error"
                    >
                      <DarkModeIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                  {/* <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton> */}
                </Box>
              </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
          </Box>
        </ThemeProvider>
      </div>
    </>
  );
};
