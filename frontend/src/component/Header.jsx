import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation } from "react-router-dom";
import { useKeycloakAuth } from "../context/KeycloakAuthContext";
import drumifyLogo from "../assets/images/drumify.png";


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
}));

const NAV_ITEMS = [
  { label: "Shop All", path: "/products" },
  { label: "Drums", path: "/category/acoustic" },
  { label: "Brands", path: "#brands" },
  { label: "Support", path: "#support" },
];

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const location = useLocation();
  const { tokenParsed, logout: keycloakLogout } = useKeycloakAuth();

  const user = {
    name: tokenParsed?.name || "Guest User",
    email: tokenParsed?.email || "guest@drumify.com",
    initials: tokenParsed?.name?.charAt(0) || "G"
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleLogout = () => {
    handleMenuClose();
    keycloakLogout();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        mt: 1.5,
        '& .MuiPaper-root': {
          width: 250,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
        }
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
          {user.email}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
        <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 'auto !important' }}>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>My Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
        <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 'auto !important' }}>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography>
      </MenuItem>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1.5, color: '#ff453a' }}>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto !important' }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Log Out</Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} to="/cart">
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flexShrink: 0 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            mr: 2,
            flexShrink: 0,
          }}
        >
          <Box
            component={"img"}
            sx={{ width: "35px", height: "35px", borderRadius: 1, mr: 1.5 }}
            src={drumifyLogo}
            alt="Drumify Logo"
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: '0.05em',
              fontSize: '1.2rem',
              display: { xs: 'none', md: 'block' },
              textTransform: 'uppercase',
            }}
          >
            Drumify
          </Typography>
        </Box>

        {/* Desktop Navigation Links */}
        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                color: location.pathname === item.path ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.7)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                '&:hover': { color: '#fff' }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search for gear..."
          inputProps={{ "aria-label": "search" }}
        />
      </Search>

      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 1 }}>
        <IconButton component={Link} to="/cart" size="large" aria-label="cart" color="inherit">
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <IconButton size="large" aria-label="notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          sx={{
            ml: 1,
            p: 0.5,
            border: '2px solid transparent',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'var(--color-accent-gold)',
              backgroundColor: 'rgba(255,184,0,0.1)'
            }
          }}
        >
          <Avatar 
            sx={{ 
              width: 35, 
              height: 35, 
              bgcolor: 'var(--color-accent-gold)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '2px solid #fff'
            }}
          >

            {user.initials}
          </Avatar>
        </IconButton>

      </Box>

      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </Box>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
