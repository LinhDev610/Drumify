import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useKeycloakAuth } from "../context/KeycloakAuthContext";
import SecurityIcon from "@mui/icons-material/Security";

export default function RoleProtectedRoute({ requiredRoles = [], requiredGroups = [] }) {
  const { authenticated, roles, groups, ready } = useKeycloakAuth();

  if (!ready) return null; 

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(r => roles.includes(r));
  const hasRequiredGroup = requiredGroups.length === 0 || requiredGroups.some(g => groups.includes(g));

  if (!hasRequiredRole && !hasRequiredGroup) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          p: 3
        }}
      >
        <SecurityIcon sx={{ fontSize: 80, color: 'var(--color-secondary)', mb: 2, opacity: 0.5 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          You don't have the necessary permissions to access this area. 
          Please contact your administrator if you believe this is an error.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = "/"}
          sx={{ borderRadius: 3, px: 4 }}
        >
          Return to Storefront
        </Button>
      </Box>
    );
  }

  return <Outlet />;
}
