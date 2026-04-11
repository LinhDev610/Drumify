import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { KeycloakAuthProvider } from "./context/KeycloakAuthContext";
import { ProfileProvider } from "./context/ProfileContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <KeycloakAuthProvider>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </KeycloakAuthProvider>,
);
