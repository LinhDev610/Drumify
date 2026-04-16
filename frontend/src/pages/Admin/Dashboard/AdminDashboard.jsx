import React from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  LinearProgress,
  Avatar,
  Grid
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTranslation } from "react-i18next";
import { useKeycloakAuth } from "../../../context/KeycloakAuthContext";
import WarehouseDashboard from "../Warehouse/WarehouseDashboard";

function DefaultAdminDashboard() {
  const { t } = useTranslation();
  const { tokenParsed } = useKeycloakAuth();

  const stats = [
    { 
      title: "Total Revenue", 
      value: "$124,500", 
      change: "+12.5%", 
      icon: <MonetizationOnIcon />, 
      color: "#2e7d32" 
    },
    { 
      title: "New Orders", 
      value: "1,240", 
      change: "+5.2%", 
      icon: <ShoppingCartIcon />, 
      color: "#0288d1" 
    },
    { 
      title: "Active Users", 
      value: "8,920", 
      change: "+8.1%", 
      icon: <PeopleIcon />, 
      color: "#ed6c02" 
    },
    { 
      title: "Conversion Rate", 
      value: "3.42%", 
      change: "+0.4%", 
      icon: <TrendingUpIcon />, 
      color: "#9c27b0" 
    },
  ];

  return (
    <Box sx={{ animation: 'fadeUp 0.6s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {t('dashboard.welcome', 'Welcome back')}, {tokenParsed?.given_name || 'Admin'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with Drumify today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.3)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={70} 
                  sx={{ 
                    mt: 2, 
                    height: 4, 
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiLinearProgress-bar': { bgcolor: stat.color }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              minHeight: 400
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Sales Statistics
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Chart Placeholder (Recharts could be added here)
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              minHeight: 400
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Recent Activities
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>U{i}</Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>New order #DRM-{1000 + i}</Typography>
                    <Typography variant="caption" color="text.secondary">{i*10} mins ago</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </Box>
  );
}

export default function AdminDashboard() {
  const { roles, groups } = useKeycloakAuth();
  if (roles.includes("ADMIN") || roles.includes("DIRECTOR")) {
    return <DefaultAdminDashboard />;
  }
  if (groups.includes("WAREHOUSE")) {
    return <WarehouseDashboard />;
  }
  return <DefaultAdminDashboard />;
}
