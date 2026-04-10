import { Outlet } from "react-router-dom";
import Scene from "../pages/Scene";

/**
 * Shared shell (app bar + drawer) for store pages.
 */
export default function MainLayout() {
  return (
    <Scene>
      <Outlet />
    </Scene>
  );
}
