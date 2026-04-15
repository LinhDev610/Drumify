import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  InputBase,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import BlockIcon from "@mui/icons-material/Block";
import { getCustomers, lockUserAccount, unlockUserAccount } from "../../../services/userService";

export default function CustomerManagement() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [viewCustomer, setViewCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      setCustomers(response.data.result || []);
    } catch (err) {
      setError("Failed to fetch customers. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.firstName && customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleLock = async (customer) => {
    const userId = customer.userId || customer.id;
    const isEnabled = customer.accountEnabled !== false;
    if (!userId) return;

    try {
      if (isEnabled) {
        await lockUserAccount(userId);
      } else {
        await unlockUserAccount(userId);
      }
      setSnackbar({
        open: true,
        message: isEnabled ? "Account locked successfully" : "Account unlocked successfully",
        severity: "success"
      });
      fetchCustomers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update account status",
        severity: "error"
      });
      console.error(err);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ animation: 'fadeUp 0.6s ease-out' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {t('customers.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('customers.subtitle')} - {customers.length} {t('customers.table.customer','total customers')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: 'var(--color-bg-deep)', 
            px: 2, 
            py: 0.8, 
            borderRadius: 3,
            border: '1px solid var(--color-border)',
            width: 300
          }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
            <InputBase 
              placeholder={t('customers.search_placeholder')}
              sx={{ color: 'inherit', fontSize: '0.9rem', width: '100%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <IconButton sx={{ border: '1px solid var(--color-border)', borderRadius: 3 }}>
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: 4,
        border: '1px solid var(--color-border)',
        boxShadow: 'none',
        overflow: 'hidden'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('customers.table.customer')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('customers.table.status')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('customers.table.total_orders')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('customers.table.total_spent')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">{t('customers.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.userId || customer.id || customer.username || customer.email} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={customer.avatar} sx={{ width: 40, height: 40, border: '2px solid var(--color-border)' }}>
                      {customer.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{customer.username} • {customer.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {customer.accountEnabled === false ? (
                    <Chip
                      label="Locked"
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ) : (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="success" 
                    variant="outlined" 
                    sx={{ fontSize: '0.7rem' }} 
                  />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">0 Đơn</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    0đ
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="View Profile">
                      <IconButton 
                        size="small" 
                        onClick={() => setViewCustomer(customer)}
                        sx={{ color: 'var(--color-primary)', bgcolor: 'rgba(212, 175, 55, 0.1)', '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.2)' } }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={customer.accountEnabled === false ? "Unlock Account" : "Lock Account"}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleLock(customer)}
                        sx={{ color: '#f44336', bgcolor: 'rgba(244, 67, 54, 0.1)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' } }}
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">{t('customers.no_customers')}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(viewCustomer)}
        onClose={() => setViewCustomer(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Customer Profile</DialogTitle>
        <DialogContent dividers>
          {viewCustomer && (
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Typography><strong>User ID:</strong> {viewCustomer.userId || "-"}</Typography>
              <Typography><strong>Username:</strong> {viewCustomer.username || "-"}</Typography>
              <Typography><strong>Email:</strong> {viewCustomer.email || "-"}</Typography>
              <Typography><strong>Full name:</strong> {`${viewCustomer.firstName || ""} ${viewCustomer.lastName || ""}`.trim() || "-"}</Typography>
              <Typography><strong>Phone:</strong> {viewCustomer.phoneNumber || "-"}</Typography>
              <Typography><strong>Status:</strong> {viewCustomer.accountEnabled === false ? "Locked" : "Active"}</Typography>
              <Typography><strong>Groups:</strong> {(viewCustomer.groups || []).join(", ") || "-"}</Typography>
              <Typography><strong>Roles:</strong> {(viewCustomer.roles || []).join(", ") || "-"}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewCustomer(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </Box>
  );
}
