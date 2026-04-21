import React, { useState } from "react";
import { Box, Paper, Tab, Tabs, Typography, Stack, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CASHIER_TAB_CONFIG = [
  { label: "Bán hàng (POS)", path: "/admin/pos" },
  { label: "Lịch sử giao dịch", path: "/admin/finance/transactions" },
  { label: "Tra cứu giá", path: "/admin/products/lookup" },
  { label: "Báo cáo ca", path: "/admin/finance/reports/shift" }
];

export default function CashierWorkspace() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = CASHIER_TAB_CONFIG.findIndex(t => t.path === location.pathname);

  return (
    <Box sx={{ animation: "fadeUp 0.4s ease-out" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {t("cashier.workspace_title", "Không gian làm việc Thu ngân")}
      </Typography>

      <Paper sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2, border: "1px solid var(--color-border)" }}>
        <Tabs
          value={currentTab !== -1 ? currentTab : 0}
          onChange={(_, val) => navigate(CASHIER_TAB_CONFIG[val].path)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" },
            "& .MuiTab-root": { fontWeight: 700, minHeight: 64 }
          }}
        >
          {CASHIER_TAB_CONFIG.map((tab, idx) => (
            <Tab key={idx} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ minHeight: 400 }}>
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "rgba(255,255,255,0.02)", borderRadius: 3, border: "1px dashed var(--color-border)" }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" color="text.secondary">
              Tính năng {CASHIER_TAB_CONFIG[currentTab]?.label || "đang chọn"} đang được phát triển.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng quay lại sau hoặc liên hệ Admin để biết thêm chi tiết.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 400 }}>
              Hệ thống đã phân quyền thành công cho nhóm CASHIER truy cập vào mục này.
            </Alert>
          </Stack>
        </Paper>
      </Box>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </Box>
  );
}
