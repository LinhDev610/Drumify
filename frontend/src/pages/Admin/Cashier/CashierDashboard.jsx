import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
  Grid
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useKeycloakAuth } from "../../../context/KeycloakAuthContext";

function StatCard({ title, value, progress, icon, color }) {
  return (
    <Card sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color: color || "var(--color-primary)" }}>{icon}</Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 2, height: 6, borderRadius: 999, "& .MuiLinearProgress-bar": { bgcolor: color } }}
        />
      </CardContent>
    </Card>
  );
}

export default function CashierDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tokenParsed } = useKeycloakAuth();
  const [loading, setLoading] = useState(false);

  // Mock data for now since we don't have a cashierService yet
  const stats = {
    shiftRevenue: "24,500,000đ",
    paidOrders: 42,
    pendingPayments: 5,
    cashInHand: "12,200,000đ"
  };

  return (
    <Box sx={{ animation: "fadeUp 0.5s ease-out" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t("cashier.dashboard_title", "Dashboard Thu Ngân")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t("dashboard.welcome", "Chào mừng trở lại")}, {tokenParsed?.given_name || "Cashier"} —{" "}
        {t("cashier.dashboard_sub", "Quản lý thanh toán, hóa đơn và doanh thu ca.")}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("cashier.stat_revenue", "Doanh thu ca")}
            value={loading ? "…" : stats.shiftRevenue}
            progress={85}
            icon={<PointOfSaleIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("cashier.stat_orders", "Đơn đã thanh toán")}
            value={loading ? "…" : String(stats.paidOrders)}
            progress={70}
            icon={<ShoppingBasketIcon />}
            color="#0288d1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("cashier.stat_pending", "Chờ thanh toán")}
            value={loading ? "…" : String(stats.pendingPayments)}
            progress={20}
            icon={<PaymentsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("cashier.stat_cash", "Tiền mặt hiện tại")}
            value={loading ? "…" : stats.cashInHand}
            progress={60}
            icon={<AssessmentIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate("/admin/pos")} startIcon={<PointOfSaleIcon />}>
          {t("cashier.goto_pos", "Mở Bán Hàng (POS)")}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/orders")}>
          {t("cashier.goto_orders", "Quản lý Đơn hàng")}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/finance/transactions")}>
          {t("cashier.goto_transactions", "Nhật ký Thu chi")}
        </Button>
      </Box>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </Box>
  );
}
