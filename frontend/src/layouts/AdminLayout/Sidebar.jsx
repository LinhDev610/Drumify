import React from "react";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider, 
  Box,
  useTheme
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useKeycloakAuth } from "../../context/KeycloakAuthContext";
import { adminSidebarConfig } from "../../config/adminSidebarConfig";

const drawerWidth = 280;

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { roles, groups, hasRole, hasGroup } = useKeycloakAuth();
  const theme = useTheme();

  const filteredMenu = adminSidebarConfig.filter(item => {
    // Nếu item không yêu cầu role/group nào, mặc định là cho phép
    const hasRoleRequirement = item.roles && item.roles.length > 0;
    const hasGroupRequirement = item.groups && item.groups.length > 0;

    const roleMatch = hasRoleRequirement ? item.roles.some(r => hasRole(r)) : false;
    const groupMatch = hasGroupRequirement ? item.groups.some(g => hasGroup(g)) : false;

    // Nếu không có yêu cầu gì, hoặc khớp Role, hoặc khớp Group
    if (!hasRoleRequirement && !hasGroupRequirement) return true;
    return roleMatch || groupMatch;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          bgcolor: 'var(--color-bg-deep)',
          borderRight: '1px solid var(--color-border)',
        },
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: 1,
            background: 'linear-gradient(45deg, var(--color-primary), #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          DRUMIFY ADMIN
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List sx={{ px: 2 }}>
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(var(--color-primary-rgb), 0.1)',
                      color: 'var(--color-primary)',
                      '&:hover': {
                        bgcolor: 'rgba(var(--color-primary-rgb), 0.15)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'var(--color-primary)',
                      }
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 45, transition: 'all 0.2s' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={t(item.title)} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem', 
                      fontWeight: active ? 600 : 400 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider sx={{ mt: 'auto', mb: 2, mx: 2, opacity: 0.5 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          v1.2.4 Professional Edition
        </Typography>
      </Box>
    </Drawer>
  );
}
