import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Card, 
  Button, 
  IconButton, 
  Divider,
  Badge,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: "Pearl Export Acoustic Kit",
    brand: "Pearl",
    price: 850,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Zildjian K Custom Special Dry",
    brand: "Zildjian",
    price: 380,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1524230659192-35f3458f2f7e?auto=format&fit=crop&q=80&w=200",
  }
];

export default function Cart() {
  const { t } = useTranslation();
  const subtotal = MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 45.00;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 8 }}>
      {/* Mesh Background */}
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: '2.5rem', color: 'var(--color-accent-gold)' }} />
          <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
            {t("cart.title")}
          </Typography>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' }, gap: 4 }}>
          {/* Left: Items List */}
          <Stack spacing={3}>
            <AnimatePresence>
              {MOCK_CART_ITEMS.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'var(--color-bg-glass)', 
                      border: '1px solid var(--color-border-glass)',
                      borderRadius: '24px',
                      display: 'flex',
                      gap: 3,
                      alignItems: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: 'var(--shadow-soft)',
                      '&:hover': { 
                        borderColor: 'var(--color-accent-gold-soft)', 
                        bgcolor: 'var(--color-bg-card)',
                        boxShadow: 'var(--shadow-premium)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        bgcolor: 'var(--color-bg-glass)',
                        border: '1px solid var(--color-border-glass)'
                      }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="overline" sx={{ color: 'var(--color-accent-gold)', fontWeight: 800, letterSpacing: 2 }}>
                        {item.brand}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--color-text-main)', mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-accent-gold)' }}>
                        ${item.price}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'var(--color-skeleton)', p: 0.5, borderRadius: '12px' }}>
                      <IconButton size="small" sx={{ color: 'var(--color-text-main)' }}><RemoveIcon /></IconButton>
                      <Typography fontWeight={800} sx={{ color: 'var(--color-text-main)', minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                      <IconButton size="small" sx={{ color: 'var(--color-text-main)' }}><AddIcon /></IconButton>
                    </Stack>

                    <IconButton sx={{ color: 'var(--color-text-muted)', '&:hover': { color: 'var(--color-brand)' } }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button 
              variant="outlined" 
              sx={{ 
                color: 'var(--color-text-dim)', 
                borderColor: 'var(--color-border)',
                borderRadius: '16px',
                py: 2,
                '&:hover': { borderColor: 'var(--color-accent-gold)', color: 'var(--color-text-main)', bgcolor: 'var(--color-bg-glass)' }
              }}
            >
              {t("cart.continue_shopping")}
            </Button>
          </Stack>

          {/* Right: Summary Card */}
          <Box sx={{ position: { lg: 'sticky' }, top: 100 }}>
            <Card 
              sx={{ 
                p: 4, 
                bgcolor: 'var(--color-bg-glass)', 
                border: '2px solid var(--color-border-glass)', 
                borderRadius: '32px',
                backdropFilter: 'blur(20px)',
                boxShadow: 'var(--shadow-premium)'
              }}
            >
              <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 4 }}>
                {t("cart.summary")}
              </Typography>

              <Stack spacing={2.5} sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: 'var(--color-text-dim)' }}>Tạm tính</Typography>
                  <Typography fontWeight={700} sx={{ color: 'var(--color-text-main)' }}>${subtotal.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: 'var(--color-text-dim)' }}>Phí vận chuyển</Typography>
                  <Typography fontWeight={700} sx={{ color: 'var(--color-text-main)' }}>${shipping.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: 'var(--color-text-dim)' }}>Thuế (10%)</Typography>
                  <Typography fontWeight={700} sx={{ color: 'var(--color-text-main)' }}>${tax.toFixed(2)}</Typography>
                </Stack>
                
                <Divider sx={{ borderColor: 'var(--color-border)' }} />
                
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Tổng cộng</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: 'var(--color-accent-gold)' }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>

              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  bgcolor: 'var(--color-accent-gold)', 
                  color: '#000', 
                  py: 2.5, 
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#fff', transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)' },
                  transition: 'all 0.3s'
                }}
              >
                {t("cart.checkout")}
              </Button>

              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                 <Chip label="SSL Secured" size="small" variant="outlined" sx={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }} />
                 <Chip label="Drumify Trust" size="small" variant="outlined" sx={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }} />
              </Stack>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
