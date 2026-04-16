import React from "react";
import { Container, Typography, Box, Button, Card, Stack } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 12 }}>
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Card sx={{ p: 6, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '40px', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-premium)' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: '5rem', color: 'var(--color-accent-gold)', mb: 3 }} />
          
          <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 2 }}>
            Đặt hàng thành công!
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'var(--color-text-dim)', mb: 4, lineHeight: 1.8 }}>
            Cảm ơn bạn đã lựa chọn Drumify! Đơn hàng {order?.code && <strong>{order.code}</strong>} của bạn đã được tiếp nhận và đang được xử lý.
          </Typography>

          <Box sx={{ p: 3, bgcolor: 'rgba(212,175,55,0.05)', borderRadius: '24px', mb: 5 }}>
            <Typography variant="subtitle2" sx={{ color: 'var(--color-accent-gold)', fontWeight: 800 }}>
              Chúng tôi đã gửi email xác nhận và chi tiết đơn hàng đến bạn.
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Button 
              variant="contained" 
              fullWidth
              size="large"
              onClick={() => navigate("/")}
              sx={{ 
                bgcolor: 'var(--color-accent-gold)', 
                color: '#000', 
                py: 2, 
                borderRadius: '16px', 
                fontWeight: 900,
                '&:hover': { bgcolor: '#fff' }
              }}
            >
              Về trang chủ
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => navigate("/profile")}
              sx={{ 
                borderColor: 'var(--color-border)', 
                color: 'var(--color-text-main)', 
                py: 2, 
                borderRadius: '16px',
                '&:hover': { borderColor: 'var(--color-accent-gold)' }
              }}
            >
              Xem đơn hàng của tôi
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
