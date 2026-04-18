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
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useKeycloakAuth } from "../context/KeycloakAuthContext";
import { useProfile } from "../context/ProfileContext";
import { useTranslation } from "react-i18next";
import { useThemeStatus } from "../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import CloudinaryImage from "./CloudinaryImage";
import drumifyLogo from "../assets/images/drumify.png";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "30px",
  backgroundColor: "var(--color-bg-card)",
  border: "1px solid var(--color-border)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "var(--color-accent-gold)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  transition: "all 0.3s ease",
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
  { label: "nav.home", path: "/" },
  { label: "nav.products", path: "/products" },
  { label: "nav.cart", path: "/cart" },
];

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeStatus();
  const { tokenParsed, authenticated, login, logout: keycloakLogout } = useKeycloakAuth();
  const { profile } = useProfile();

  const toggleLanguage = () => {
    const nextLng = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(nextLng);
  };

  const user = {
    name: profile?.fullName || tokenParsed?.name || "Guest User",
    email: profile?.email || tokenParsed?.email || "guest@drumify.com",
    initials: (profile?.fullName || tokenParsed?.name)?.charAt(0) || "G",
    avatarUrl: profile?.avatarUrl
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
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.1)',
          backgroundColor: isDarkMode ? 'rgba(28, 28, 30, 0.95)' : '#fff',
          backdropFilter: 'blur(20px)',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          color: isDarkMode ? '#fff' : '#000',
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
      <MenuItem component={Link} to="/profile?tab=profile" onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto !important' }}>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('profile.tabs.profile')}</Typography>
      </MenuItem>
      <MenuItem component={Link} to="/profile?tab=orders" onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto !important' }}>
          <ShoppingBagIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('profile.tabs.orders')}</Typography>
      </MenuItem>
      <MenuItem component={Link} to="/profile?tab=vouchers" onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto !important' }}>
          <ConfirmationNumberIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('profile.tabs.vouchers')}</Typography>
      </MenuItem>
      <MenuItem component={Link} to="/profile?tab=security" onClick={handleMenuClose} sx={{ py: 1.2, gap: 1.5 }}>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto !important' }}>
          <LockResetIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('profile.tabs.security')}</Typography>
      </MenuItem>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1.5, color: '#ff453a' }}>
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto !important' }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{t("nav.logout")}</Typography>
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
        <p>Giỏ hàng</p>
      </MenuItem>
      {authenticated ? (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton size="large" color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Tài khoản</p>
        </MenuItem>
      ) : (
        <MenuItem onClick={() => login()}>
          <IconButton size="large" color="inherit">
            <LoginIcon />
          </IconButton>
          <p>Đăng nhập</p>
        </MenuItem>
      )}
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
            sx={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#fff', // Permanent white background for logo visibility
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <Box
              component={"img"}
              sx={{
                width: "28px",
                height: "28px",
                objectFit: 'contain'
              }}
              src={drumifyLogo}
              alt="Drumify Logo"
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: '0.05em',
              fontSize: '1.2rem',
              display: { xs: 'none', md: 'block' },
              textTransform: 'uppercase',
              color: 'var(--color-text-main)'
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
                color: location.pathname === item.path ? 'var(--color-accent-gold)' : (isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                px: 2,
                '&:hover': {
                  color: item.path.startsWith('#') ? 'var(--color-accent-gold)' : (isDarkMode ? '#fff' : '#000'),
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
                },
                position: 'relative',
                '&::after': location.pathname === item.path ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 6,
                  left: '20%',
                  width: '60%',
                  height: '2px',
                  bgcolor: 'var(--color-accent-gold)',
                  borderRadius: '2px'
                } : {}
              }}
            >
              {t(item.label)}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <Search sx={{
        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        color: isDarkMode ? '#fff' : '#000'
      }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={t("nav.home") + "..."}
          inputProps={{ "aria-label": "search" }}
        />
      </Search>

      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 1 }}>
        {/* Preference Toggles (Desktop) */}
        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              color: isDarkMode ? 'var(--color-accent-gold)' : 'rgba(0,0,0,0.5)',
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button
            onClick={toggleLanguage}
            size="small"
            startIcon={<LanguageIcon />}
            sx={{
              color: isDarkMode ? '#fff' : '#000',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              borderRadius: '10px',
              px: 1.5
            }}
          >
            {i18n.language === 'en' ? 'EN' : 'VI'}
          </Button>
        </Stack>

        <IconButton component={Link} to="/cart" size="large" aria-label="cart" color="inherit">
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {authenticated ? (
          <>
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
                  border: isDarkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid var(--color-accent-gold)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                {user.avatarUrl ? (
                  <CloudinaryImage
                    publicId={user.avatarUrl}
                    type="avatar"
                    width={70}
                    height={70}
                  />
                ) : user.initials}
              </Avatar>
            </IconButton>
          </>
        ) : (
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => login()}
            sx={{
              ml: 1,
              background: isDarkMode
                ? 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)'
                : 'linear-gradient(135deg, #000 0%, #333 100%)',
              color: isDarkMode ? '#000' : '#fff',
              fontWeight: 900,
              textTransform: 'none',
              borderRadius: '14px',
              py: 1.2,
              px: 3.5,
              boxShadow: isDarkMode
                ? '0 4px 15px rgba(212, 175, 55, 0.3)'
                : '0 4px 15px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: isDarkMode
                  ? 'white'
                  : 'var(--color-accent-gold)',
                color: '#000',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: isDarkMode
                  ? '0 10px 25px rgba(212, 175, 55, 0.5)'
                  : '0 10px 25px rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {t("nav.login")}
          </Button>
        )}
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
