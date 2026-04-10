import { Container, Typography } from "@mui/material";
import { useKeycloakAuth } from "../../context/KeycloakAuthContext";

export default function Profile() {
  const { tokenParsed } = useKeycloakAuth();
  const username = tokenParsed?.preferred_username ?? tokenParsed?.sub ?? "—";

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Signed in as <strong>{username}</strong>
      </Typography>
    </Container>
  );
}
