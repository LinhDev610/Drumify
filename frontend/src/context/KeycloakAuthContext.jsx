import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import keycloak from "../keycloak";

const KeycloakAuthContext = createContext(null);

/**
 * Initializes keycloak-js once, exposes ready/authenticated, and keeps state in sync
 * with login, logout, and errors (works with SSO cookies / check-sso).
 */
export function KeycloakAuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const sync = () => {
      if (!cancelled) setAuthenticated(Boolean(keycloak.authenticated));
    };

    keycloak
      .init({
        onLoad: "check-sso",
      })
      .then((auth) => {
        if (cancelled) return;
        setAuthenticated(Boolean(auth));
        setReady(true);
        keycloak.onAuthSuccess = sync;
        keycloak.onAuthLogout = sync;
        keycloak.onAuthError = sync;
      })
      .catch((err) => {
        console.error("[Keycloak] init failed:", err);
        if (!cancelled) {
          setAuthenticated(false);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthLogout = undefined;
      keycloak.onAuthError = undefined;
    };
  }, []);

  const login = useCallback((options) => keycloak.login(options), []);
  const logout = useCallback((options) => keycloak.logout(options), []);

  const value = useMemo(
    () => ({
      ready,
      authenticated,
      login,
      logout,
      token: keycloak.token,
      tokenParsed: keycloak.tokenParsed,
    }),
    [ready, authenticated, login, logout],
  );

  if (!ready) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress aria-label="Loading authentication" />
      </Box>
    );
  }

  return <KeycloakAuthContext.Provider value={value}>{children}</KeycloakAuthContext.Provider>;
}

export function useKeycloakAuth() {
  const ctx = useContext(KeycloakAuthContext);
  if (!ctx) {
    throw new Error("useKeycloakAuth must be used within KeycloakAuthProvider");
  }
  return ctx;
}
