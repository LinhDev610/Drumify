import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n"; // Import i18n configuration
import App from "./App";
import { KeycloakAuthProvider } from "./context/KeycloakAuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <KeycloakAuthProvider>
    <ProfileProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ProfileProvider>
  </KeycloakAuthProvider>,
);
