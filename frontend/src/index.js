import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import keycloak from "./keycloak"
import App from './App';
import { Box, CircularProgress } from "@mui/material";


const Main = () => {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "check-sso", // Check user đăng nhập ở đâu khác chưa
      })
      .then((authenticated) => { // authenticated: giá trị Boolean được Keycloak trả về sau khi quá trình khởi tạo hoàn tất.
        setKeycloakInitialized(true)
      })
      .catch((err) => {
        console.error("Authenticated Failed", err);
      });
  }, []);

  if (!keycloakInitialized) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress></CircularProgress>
        </Box>
      </>
    )
  }

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);