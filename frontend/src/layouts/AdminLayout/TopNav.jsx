import React from "react";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Avatar, 
  Tooltip,
  InputBase,
  Alpha
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { useKeycloakAuth } from "../../context/KeycloakAuthContext";

export default function TopNav() {
  const { t, i18n } = useTranslation();
  const { tokenParsed, logout } = useKeycloakAuth();

  const handleLogout = () => {
    logout();
  };

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'var(--color-bg-deep)',
        color: 'var(--color-text-main)',
        boxShadow: 'none',
        borderBottom: '1px solid var(--color-border)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              width: { xs: 200, md: 350 },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder={t('nav.search_placeholder', 'Search reports, orders...')}
              sx={{ color: 'inherit', fontSize: '0.9rem', width: '100%' }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Switch Language">
            <IconButton onClick={toggleLanguage} color="inherit">
              <LanguageIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 700 }}>
                {i18n.language.toUpperCase()}
              </Typography>
            </IconButton>
          </Tooltip>

          <IconButton color="inherit">
            <NotificationsIcon fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ lineHeight: 1, fontWeight: 600 }}>
                {tokenParsed?.name || "Admin"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tokenParsed?.realm_access?.roles?.[0] || "Staff"}
              </Typography>
            </Box>
            <Avatar 
              src={tokenParsed?.avatar} 
              sx={{ width: 36, height: 36, cursor: 'pointer', border: '2px solid var(--color-primary)' }}
              onClick={() => {}}
            />

            <Tooltip title={t('nav.logout')}>
              <IconButton 
                onClick={handleLogout} 
                sx={{ 
                  color: 'var(--color-secondary)',
                  bgcolor: 'rgba(211, 47, 47, 0.05)',
                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' },
                  ml: 1
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const Divider = ({ orientation, sx }) => (
  <Box 
    sx={{ 
      width: orientation === 'vertical' ? '1px' : '100%', 
      height: orientation === 'vertical' ? '100%' : '1px', 
      bgcolor: 'var(--color-border)',
      ...sx 
    }} 
  />
);
