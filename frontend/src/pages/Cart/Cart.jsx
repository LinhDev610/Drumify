import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Stack,
  Card,
  Button,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getCart, updateCartItemQuantity, removeCartItem } from "../../services/cartService";
import keycloak from "../../keycloak";

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
      // Auto-select all items on first load
      if (data?.cartItems) {
        setSelectedIds(new Set(data.cartItems.map(item => item.id)));
      }
    } catch (err) {
      setError("Không thể tải giỏ hàng. Vui lòng đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak.authenticated) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const updatedCart = await updateCartItemQuantity(itemId, newQty);
      setCart(updatedCart);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const toggleSelect = (itemId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const items = cart?.cartItems || [];
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  const items = cart?.cartItems || [];
  const selectedItems = items.filter(item => selectedIds.has(item.id));

  const selectedSubtotal = selectedItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);
  const selectedTotal = selectedSubtotal; // Simplified, excluding global voucher for now if not selected

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg-deep)' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!keycloak.authenticated || error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ShoppingBagOutlinedIcon sx={{ fontSize: '5rem', color: 'var(--color-text-dim)', mb: 3, mx: 'auto' }} />
        <Typography variant="h4" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 2 }}>{t("cart.please_login")}</Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-dim)', mb: 4 }}>Đăng nhập để xem và quản lý giỏ hàng của bạn.</Typography>
        <Box sx={{ maxWidth: 300, mx: 'auto', width: '100%' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => keycloak.login()}
            sx={{ bgcolor: 'var(--color-accent-gold)', color: '#000', fontWeight: 900, borderRadius: '16px' }}
          >
            Đăng nhập ngay
          </Button>
        </Box>
      </Container>
    );
  }

  const hasItems = items.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 8 }}>
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: '2.5rem', color: 'var(--color-accent-gold)' }} />
            <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
              {t("cart.title")}
            </Typography>
          </Stack>

          {hasItems && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedIds.size === items.length && items.length > 0}
                  indeterminate={selectedIds.size > 0 && selectedIds.size < items.length}
                  onChange={toggleSelectAll}
                  sx={{ color: 'var(--color-text-dim)', '&.Mui-checked': { color: 'var(--color-accent-gold)' } }}
                />
              }
              label={<Typography fontWeight={700} sx={{ color: 'var(--color-text-dim)' }}>Chọn tất cả ({items.length})</Typography>}
            />
          )}
        </Stack>

        {!hasItems ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="var(--color-text-dim)" sx={{ mb: 4 }}>Giỏ hàng của bạn đang trống.</Typography>
            <Button variant="contained" size="large" onClick={() => navigate("/")} sx={{ borderRadius: '16px', py: 2, px: 6 }}>Tiếp tục mua sắm</Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' }, gap: 4 }}>
            <Stack spacing={3}>
              <AnimatePresence>
                {items.map((item) => (
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
                        border: '1.5px solid',
                        borderColor: selectedIds.has(item.id) ? 'var(--color-accent-gold-soft)' : 'var(--color-border-glass)',
                        borderRadius: '24px',
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'var(--color-bg-card)',
                          boxShadow: 'var(--shadow-premium)',
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        sx={{ color: 'var(--color-text-dim)', '&.Mui-checked': { color: 'var(--color-accent-gold)' } }}
                      />

                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          bgcolor: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--color-border-glass)'
                        }}
                      >
                        <img
                          src={item.productImageUrl || "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=200"}
                          alt={item.productName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="overline" sx={{ color: 'var(--color-accent-gold)', fontWeight: 800, letterSpacing: 2, display: 'block', lineHeight: 1 }}>
                          {item.variantName}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--color-text-main)', mb: 0.5, lineHeight: 1.2 }}>
                          {item.productName}
                        </Typography>
                        <Typography variant="h6" fontWeight={900} sx={{ color: 'var(--color-text-main)' }}>
                          {item.unitPrice?.toLocaleString()} VND
                        </Typography>
                      </Box>

                      <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', p: 0.5, borderRadius: '12px' }}>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} sx={{ color: 'var(--color-text-main)' }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography fontWeight={800} sx={{ color: 'var(--color-text-main)', minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} sx={{ color: 'var(--color-text-main)' }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <IconButton onClick={() => handleRemoveItem(item.id)} sx={{ color: 'var(--color-text-muted)', '&:hover': { color: 'var(--color-brand)' } }}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>

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
                    <Typography sx={{ color: 'var(--color-text-dim)' }}>Tạm tính ({selectedIds.size} sản phẩm)</Typography>
                    <Typography fontWeight={700} sx={{ color: 'var(--color-text-main)' }}>{selectedSubtotal.toLocaleString()} VND</Typography>
                  </Stack>

                  <Divider sx={{ borderColor: 'var(--color-border)' }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Typography sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Tổng cộng</Typography>
                    <Typography variant="h4" fontWeight={900} sx={{ color: 'var(--color-accent-gold)' }}>
                      {selectedTotal.toLocaleString()} VND
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={selectedIds.size === 0}
                  onClick={() => navigate("/checkout", { state: { selectedItemIds: Array.from(selectedIds) } })}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: 'var(--color-accent-gold)',
                    color: '#000',
                    py: 2.5,
                    borderRadius: '16px',
                    fontWeight: 900,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#fff', transform: 'translateY(-3px)' },
                    transition: 'all 0.3s',
                    '&.Mui-disabled': { bgcolor: 'var(--color-border)', color: 'var(--color-text-dim)' }
                  }}
                >
                  {t("cart.checkout")}
                </Button>
              </Card>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
