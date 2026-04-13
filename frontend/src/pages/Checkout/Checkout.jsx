import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Grid, 
  Card, 
  TextField, 
  Button, 
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 8 }}>
      {/* Mesh Background */}
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Button 
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.9rem' }} />} 
          onClick={() => navigate('/cart')}
          sx={{ color: 'var(--color-text-dim)', mb: 4, '&:hover': { color: 'var(--color-accent-gold)' } }}
        >
          {t("cart.continue_shopping")}
        </Button>

        <Grid container spacing={6}>
          {/* Left: Information Forms */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              {/* Shipping Info */}
              <Card sx={{ p: 5, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(10px)' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <LocalShippingIcon sx={{ color: 'var(--color-accent-gold)' }} />
                  <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)' }}>Shipping Information</Typography>
                </Stack>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="First Name" variant="outlined" sx={textFieldStyle} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Last Name" variant="outlined" sx={textFieldStyle} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address" variant="outlined" sx={textFieldStyle} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="City" variant="outlined" sx={textFieldStyle} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone Number" variant="outlined" sx={textFieldStyle} />
                  </Grid>
                </Grid>
              </Card>

              {/* Payment Method */}
              <Card sx={{ p: 5, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(10px)' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <PaymentIcon sx={{ color: 'var(--color-accent-gold)' }} />
                  <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)' }}>Payment Method</Typography>
                </Stack>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup defaultValue="credit_card">
                    <Stack spacing={2}>
                      <PaymentOption value="credit_card" label="Credit Card" />
                      <PaymentOption value="paypal" label="PayPal" />
                      <PaymentOption value="cod" label="Cash on Delivery" />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Card>
            </Stack>
          </Grid>

          {/* Right: Order Summary */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Card sx={{ p: 4, bgcolor: 'var(--color-bg-glass)', border: '2px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-premium)' }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 4 }}>Order Review</Typography>
                
                <Stack spacing={2.5} sx={{ mb: 4 }}>
                   {/* Simple Summary Items */}
                   <SummaryRow label="Subtotal" value="$1,230.00" />
                   <SummaryRow label="Shipping" value="$45.00" />
                   <SummaryRow label="Tax (10%)" value="$123.00" />
                   <Divider sx={{ borderColor: 'var(--color-border)' }} />
                   <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                      <Typography sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Total Price</Typography>
                      <Typography variant="h4" fontWeight={900} sx={{ color: 'var(--color-accent-gold)' }}>$1,398.00</Typography>
                   </Stack>
                </Stack>

                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    bgcolor: 'var(--color-accent-gold)', 
                    color: '#000', 
                    py: 2.5, 
                    borderRadius: '16px', 
                    fontWeight: 900, 
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#fff', transform: 'translateY(-3px)' }
                  }}
                >
                  Place Order
                </Button>

                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 3, color: 'var(--color-text-muted)' }}>
                  <ShieldIcon sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Secure End-to-End Encryption</Typography>
                </Stack>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'var(--color-text-main)',
    bgcolor: 'var(--color-bg-glass)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'var(--color-border)' },
    '&:hover fieldset': { borderColor: 'var(--color-accent-gold)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-accent-gold)' }
  },
  '& .MuiInputLabel-root': { color: 'var(--color-text-muted)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-accent-gold)' }
};

function SummaryRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography sx={{ color: 'var(--color-text-dim)' }}>{label}</Typography>
      <Typography fontWeight={700} sx={{ color: 'var(--color-text-main)' }}>{value}</Typography>
    </Stack>
  );
}

function PaymentOption({ value, label }) {
  return (
    <Box 
      sx={{ 
        border: '1px solid var(--color-border)', 
        borderRadius: '16px', 
        p: 1, 
        px: 3, 
        '&:hover': { borderColor: 'var(--color-accent-gold)', bgcolor: 'var(--color-bg-glass)' } 
      }}
    >
      <FormControlLabel 
        value={value} 
        control={<Radio sx={{ color: 'var(--color-text-muted)', '&.Mui-checked': { color: 'var(--color-accent-gold)' } }} />} 
        label={<Typography sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{label}</Typography>} 
      />
    </Box>
  );
}
