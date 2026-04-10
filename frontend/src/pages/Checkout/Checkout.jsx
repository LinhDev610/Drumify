import { Container, Typography } from "@mui/material";

export default function Checkout() {
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Checkout flow will appear here after you add items to the cart.
      </Typography>
    </Container>
  );
}
