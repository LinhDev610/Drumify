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

  const login = useCallback(
    (options) =>
      keycloak.login({
        redirectUri: window.location.href, // Mặc định quay lại trang đang đứng
        ...options,
      }),
    [],
  );

  const logout = useCallback(
    (options) =>
      keycloak.logout({
        redirectUri: window.location.origin + "/", // Mặc định về trang chủ
        ...options,
      }),
    [],
  );

  const roles = useMemo(() => keycloak.tokenParsed?.realm_access?.roles || [], [ready, authenticated]);
  const groups = useMemo(() => {
    return keycloak.tokenParsed?.groups || keycloak.tokenParsed?.user_groups || [];
  }, [ready, authenticated]);

  const hasRole = useCallback((role) => roles.includes(role), [roles]);
  const hasGroup = useCallback((group) => {
    if (!groups) return false;
    return groups.includes(group) || groups.some(g => g.includes(group));
  }, [groups]);

  const value = useMemo(
    () => ({
      ready,
      authenticated,
      login,
      logout,
      token: keycloak.token,
      tokenParsed: keycloak.tokenParsed,
      roles,
      groups,
      hasRole,
      hasGroup,
    }),
    [ready, authenticated, login, logout, roles, groups, hasRole, hasGroup],
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
