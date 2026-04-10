import { Container, Typography } from "@mui/material";

export default function Cart() {
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cart
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your cart is empty for now.
      </Typography>
    </Container>
  );
}
