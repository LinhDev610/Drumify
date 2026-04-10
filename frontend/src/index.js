import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { KeycloakAuthProvider } from "./context/KeycloakAuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <KeycloakAuthProvider>
    <App />
  </KeycloakAuthProvider>,
);
