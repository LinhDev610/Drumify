import { useCallback, useEffect, useRef } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useKeycloakAuth } from "../context/KeycloakAuthContext";

/**
 * Requires Keycloak session. Unauthenticated users are sent to the Keycloak login page
 * (no local /login route). Shows loading until redirect starts; offers manual retry if needed.
 */
export default function ProtectedRoute() {
  const { authenticated, login } = useKeycloakAuth();
  const loginTriggered = useRef(false);

  const redirectToKeycloak = useCallback(
    () => login(),
    [login],
  );

  useEffect(() => {
    if (authenticated) {
      loginTriggered.current = false;
      return;
    }
    if (loginTriggered.current) return;
    loginTriggered.current = true;
    redirectToKeycloak();
  }, [authenticated, redirectToKeycloak]);

  if (!authenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          minHeight: 240, 
          py: 6,
        }}
      >
        <CircularProgress aria-label="Signing in" />
        <Typography variant="body2" color="text.secondary">
          Redirecting to sign in…
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            loginTriggered.current = false;
            redirectToKeycloak();
          }}
        >
          Sign in again
        </Button>
      </Box>
    );
  }

  return <Outlet />;
}
