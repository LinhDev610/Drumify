import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Card, 
  Button, 
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  Chip,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyProfile } from "../../services/userService";
import { getCart } from "../../services/cartService";
import { placeOrder } from "../../services/orderService";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItemIds = location.state?.selectedItemIds || [];

  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedItemIds.length === 0) {
      navigate("/cart");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [profileRes, cartRes] = await Promise.all([getMyProfile(), getCart()]);
        setProfile(profileRes.data.result);
        
        // Filter cart items
        const rawCart = cartRes;
        const filteredItems = rawCart.cartItems.filter(item => selectedItemIds.includes(item.id));
        const filteredSubtotal = filteredItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);
        
        setCart({
          ...rawCart,
          cartItems: filteredItems,
          subtotal: filteredSubtotal,
          totalAmount: filteredSubtotal // Simplified
        });
        
        const addresses = profileRes.data.result.addresses || [];
        if (addresses.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
      } catch (err) {
        setError("Không thể tải thông tin thanh toán. Vui lòng đăng nhập.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedItemIds, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn hoặc thêm địa chỉ giao hàng.");
      return;
    }
    try {
      setSubmitting(true);
      const orderData = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
        shippingFee: 30000, 
        note: "",
        cartItemIds: selectedItemIds // Pass selected items to backend
      };
      const result = await placeOrder(orderData);
      navigate("/order-success", { state: { order: result } });
    } catch (err) {
      alert("Đặt hàng không thành công. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg-deep)' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 4 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate("/cart")}>Quay lại giỏ hàng</Button>
      </Container>
    );
  }

  const addresses = profile?.addresses || [];
  const shippingFee = 30000;
  const total = (cart?.totalAmount || 0) + shippingFee;

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 8 }}>
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Button 
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.9rem' }} />} 
          onClick={() => navigate('/cart')}
          sx={{ color: 'var(--color-text-dim)', mb: 4, '&:hover': { color: 'var(--color-accent-gold)' } }}
        >
          {t("cart.back_to_cart")}
        </Button>

        <Grid container spacing={6}>
          {/* Left: Forms */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={4}>
              {/* Shipping Address Selection */}
              <Card sx={{ p: 5, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(10px)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <LocationOnIcon sx={{ color: 'var(--color-accent-gold)' }} />
                    <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)' }}>Địa chỉ giao hàng</Typography>
                  </Stack>
                  <Button onClick={() => navigate("/profile")} sx={{ color: 'var(--color-accent-gold)' }}>Quản lý địa chỉ</Button>
                </Stack>
                
                {addresses.length === 0 ? (
                  <Alert severity="info">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ trong trang cá nhân.</Alert>
                ) : (
                  <RadioGroup value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
                    <Grid container spacing={2}>
                      {addresses.map((addr) => (
                        <Grid size={12} key={addr.id}>
                          <Paper 
                            sx={{ 
                              p: 3, 
                              borderRadius: '16px', 
                              bgcolor: selectedAddressId === addr.id ? 'rgba(212,175,55,0.05)' : 'var(--color-bg-glass)',
                              border: '1.5px solid',
                              borderColor: selectedAddressId === addr.id ? 'var(--color-accent-gold)' : 'var(--color-border-glass)',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <Stack direction="row" spacing={3} alignItems="flex-start">
                              <FormControlLabel 
                                value={addr.id} 
                                control={<Radio sx={{ color: 'var(--color-text-muted)', '&.Mui-checked': { color: 'var(--color-accent-gold)' } }} />} 
                                label="" 
                              />
                              <Box>
                                <Typography fontWeight={700} sx={{ color: 'var(--color-text-main)' }}>{addr.recipientName} • {addr.recipientPhoneNumber}</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-dim)', mt: 0.5 }}>
                                  {addr.address}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                                </Typography>
                                {addr.isDefault && <Chip label="Mặc định" size="small" sx={{ mt: 1, bgcolor: 'var(--color-accent-gold)', color: '#000', fontWeight: 700 }} />}
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                )}
              </Card>

              {/* Payment Method */}
              <Card sx={{ p: 5, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(10px)' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <PaymentIcon sx={{ color: 'var(--color-accent-gold)' }} />
                  <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)' }}>Phương thức thanh toán</Typography>
                </Stack>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <Stack spacing={2}>
                      <PaymentOption value="COD" label="Thanh toán khi nhận hàng (COD)" description="Thanh toán bằng tiền mặt khi shipper giao hàng." icon={<LocalShippingIcon />} />
                      <PaymentOption value="MOMO" label="Ví MoMo (Chưa hỗ trợ)" description="Thanh toán nhanh qua ứng dụng MoMo." disabled icon={<Avatar src="https://static.mservice.io/img/logo-momo.png" sx={{ width: 24, height: 24 }} />} />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Card>
            </Stack>
          </Grid>

          {/* Right: Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Card sx={{ p: 4, bgcolor: 'var(--color-bg-glass)', border: '2px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-premium)' }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 4 }}>Tóm tắt đơn hàng</Typography>
                
                <Stack spacing={2.5} sx={{ mb: 4 }}>
                   <SummaryRow label="Tạm tính" value={cart.subtotal?.toLocaleString() + " VND"} />
                   <SummaryRow label="Phí vận chuyển" value={shippingFee.toLocaleString() + " VND"} />
                   {cart.voucherDiscount > 0 && <SummaryRow label="Giảm giá" value={"-" + cart.voucherDiscount?.toLocaleString() + " VND"} color="var(--color-brand)" />}
                   
                   <Divider sx={{ borderColor: 'var(--color-border)' }} />
                   
                   <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                      <Typography sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Tổng tiền</Typography>
                      <Typography variant="h4" fontWeight={900} sx={{ color: 'var(--color-accent-gold)' }}>
                        {total.toLocaleString()} VND
                      </Typography>
                   </Stack>
                </Stack>

                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  onClick={handlePlaceOrder}
                  disabled={submitting || !selectedAddressId}
                  sx={{ 
                    bgcolor: 'var(--color-accent-gold)', 
                    color: '#000', 
                    py: 2.5, 
                    borderRadius: '16px', 
                    fontWeight: 900, 
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#fff', transform: 'translateY(-3px)' },
                    '&.Mui-disabled': { bgcolor: 'var(--color-border)', color: 'var(--color-text-dim)' }
                  }}
                >
                  {submitting ? <CircularProgress size={24} /> : "Xác nhận đặt hàng"}
                </Button>

                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 3, color: 'var(--color-text-muted)' }}>
                  <ShieldIcon sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Thanh toán an toàn & Bảo mật</Typography>
                </Stack>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function SummaryRow({ label, value, color }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography sx={{ color: 'var(--color-text-dim)' }}>{label}</Typography>
      <Typography fontWeight={700} sx={{ color: color || 'var(--color-text-main)' }}>{value}</Typography>
    </Stack>
  );
}

function PaymentOption({ value, label, description, disabled, icon }) {
  return (
    <Box 
      sx={{ 
        border: '1px solid var(--color-border)', 
        borderRadius: '16px', 
        p: 2, 
        px: 3, 
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        '&:hover': { borderColor: disabled ? 'var(--color-border)' : 'var(--color-accent-gold)', bgcolor: disabled ? 'transparent' : 'var(--color-bg-glass)' } 
      }}
    >
      <FormControlLabel 
        value={value} 
        disabled={disabled}
        control={<Radio sx={{ color: 'var(--color-text-muted)', '&.Mui-checked': { color: 'var(--color-accent-gold)' } }} />} 
        label={
          <Stack direction="row" spacing={2} alignItems="center">
            {icon}
            <Box>
              <Typography sx={{ color: 'var(--color-text-main)', fontWeight: 700 }}>{label}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-dim)' }}>{description}</Typography>
            </Box>
          </Stack>
        } 
      />
    </Box>
  );
}
