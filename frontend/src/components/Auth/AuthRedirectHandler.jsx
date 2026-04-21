import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloakAuth } from "../../context/KeycloakAuthContext";

export default function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, roles, groups, ready, hasGroup } = useKeycloakAuth();

  useEffect(() => {
    if (!ready || !authenticated) return;

    const isOnHomePage = location.pathname === "/";
    const isAdminRole = ["ADMIN", "DIRECTOR", "STAFF"].some(r => roles.includes(r));
    const isFunctionalGroup = ["HR", "WAREHOUSE", "CASHIER", "CS", "MARKETING"].some(g => hasGroup(g));

    if (isOnHomePage && (isAdminRole || isFunctionalGroup)) {
      let target = "/admin";

      if (hasGroup("HR")) target = "/admin/hr";
      else if (hasGroup("WAREHOUSE")) target = "/admin/inventory";
      else if (hasGroup("CASHIER")) target = "/admin/pos";
      else if (hasGroup("CS")) target = "/admin/support";
      else if (hasGroup("MARKETING")) target = "/admin/marketing";

      const timer = setTimeout(() => {
        navigate(target, { replace: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authenticated, roles, groups, ready, location.pathname, navigate, hasGroup]);

  return null;
}
