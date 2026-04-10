import keycloak from "../keycloak";

export const logout = () => {
  keycloak.logout({ redirectUri: window.location.origin + "/" });
};