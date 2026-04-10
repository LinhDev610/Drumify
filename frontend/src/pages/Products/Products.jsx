import { Container, Typography } from "@mui/material";

export default function Products() {
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Browse drums, cymbals, and percussion. (Catalog API can be wired here later.)
      </Typography>
    </Container>
  );
}
