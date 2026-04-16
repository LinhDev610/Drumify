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
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useKeycloakAuth } from "../../../context/KeycloakAuthContext";
import { fetchWarehouseDashboard } from "../../../services/warehouseService";
import { getErrorMessage } from "../../../hooks/utils/unwrapApiResponse";

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

export default function WarehouseDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tokenParsed } = useKeycloakAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await fetchWarehouseDashboard();
        if (!cancelled) setStats(d);
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e, "Không tải được dữ liệu kho."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const low = stats?.lowStockAlerts ?? 0;
  const total = stats?.totalSkuLines ?? 0;
  const pending = stats?.ordersAwaitingPack ?? 0;
  const transit = stats?.shipmentsInTransit ?? 0;

  return (
    <Box sx={{ animation: "fadeUp 0.5s ease-out" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t("warehouse.dashboard_title", "Dashboard Kho")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t("dashboard.welcome", "Chào mừng trở lại")}, {tokenParsed?.given_name || "Staff"} —{" "}
        {t("warehouse.dashboard_sub", "Tồn kho, đơn cần đóng gói và vận chuyển.")}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("warehouse.stat_lines", "Dòng SKU trong kho")}
            value={loading ? "…" : String(total)}
            progress={72}
            icon={<InventoryIcon />}
            color="#0288d1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("warehouse.stat_low", "Cảnh báo tồn thấp")}
            value={loading ? "…" : String(low)}
            progress={low > 0 ? Math.min(100, 20 + low * 5) : 12}
            icon={<WarningAmberIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("warehouse.stat_pack", "Đơn chờ đóng gói")}
            value={loading ? "…" : String(pending)}
            progress={pending > 0 ? Math.min(100, 25 + pending * 8) : 15}
            icon={<ShoppingBasketIcon />}
            color="#9c27b0"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("warehouse.stat_transit", "Lô đang vận chuyển")}
            value={loading ? "…" : String(transit)}
            progress={55}
            icon={<LocalShippingIcon />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button variant="contained" onClick={() => navigate("/admin/inventory")}>
          {t("warehouse.goto_inventory", "Mở tồn kho")}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/inventory/import")}>
          {t("warehouse.goto_import", "Nhập hàng")}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/orders")}>
          {t("warehouse.goto_orders", "Đơn cần xử lý")}
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
