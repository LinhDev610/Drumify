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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getStaff, assignRoles, assignGroups, getRoles, getGroups, createStaff, lockUserAccount, unlockUserAccount } from "../../../services/userService";
import UserEditModal from "./components/UserEditModal";
import UserCreationModal from "./components/UserCreationModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function HRManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRolesAndGroups();
  }, []);

  const fetchRolesAndGroups = async () => {
    try {
      const [rolesRes, groupsRes] = await Promise.all([
        getRoles(),
        getGroups()
      ]);
      setRolesList(rolesRes.data.result || []);
      setGroupsList(groupsRes.data.result || []);
    } catch (err) {
      console.error("Failed to fetch roles/groups", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getStaff();
      setUsers(response.data.result || []);
    } catch (err) {
      setError("Failed to fetch employees. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissions = async (userId, roles, groups) => {
    try {
      await Promise.all([
        assignRoles(userId, roles),
        assignGroups(userId, groups)
      ]);
      setSnackbar({ open: true, message: t('hr.success_update'), severity: "success" });
      fetchUsers(); // Refresh list
    } catch (err) {
      setSnackbar({ open: true, message: t('profile.general.failed'), severity: "error" });
      throw err;
    }
  };

  const handleCreateStaff = async (formData) => {
    try {
      await createStaff(formData);
      setSnackbar({ open: true, message: "Staff account created successfully", severity: "success" });
      setCreateModalOpen(false);
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to create staff account", severity: "error" });
      throw err;
    }
  };

  const handleToggleLock = async (user) => {
    const userId = user.userId || user.id;
    const isEnabled = user.accountEnabled !== false;
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
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update account status",
        severity: "error"
      });
      console.error(err);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && users.length === 0) {
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
            {t('hr.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('hr.staff_directory')} - {users.length} {t('hr.table.user','total employees')}
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
              placeholder="Search employee..." 
              sx={{ color: 'inherit', fontSize: '0.9rem', width: '100%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Tooltip title="Create Staff Account">
            <IconButton 
              color="primary"
              onClick={() => setCreateModalOpen(true)}
              sx={{ border: '1px solid var(--color-primary)', borderRadius: 3, bgcolor: 'rgba(212, 175, 55, 0.1)' }}
            >
              <PersonAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
              <TableCell sx={{ fontWeight: 700 }}>{t('hr.table.user')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('hr.table.roles')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('hr.table.groups')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('customers.table.status', 'Status')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">{t('hr.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.userId || user.id || user.username || user.email} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.avatar} sx={{ width: 40, height: 40, border: '2px solid var(--color-border)' }}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username} • {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {user.roles?.map(role => (
                      <Chip key={`${user.userId || user.username || user.email}-role-${role}`} label={role} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {user.groups?.map(group => (
                      <Chip key={`${user.userId || user.username || user.email}-group-${group}`} label={group} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {user.accountEnabled === false ? (
                    <Chip label="Locked" size="small" color="error" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  ) : (
                    <Chip label="Active" size="small" color="success" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="View Profile">
                      <IconButton 
                        size="small"
                        onClick={() => setViewUser(user)}
                        sx={{ color: 'var(--color-primary)', bgcolor: 'rgba(212, 175, 55, 0.1)', '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.2)' } }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.accountEnabled === false ? "Unlock Account" : "Lock Account"}>
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleLock(user)}
                        sx={{ color: '#f44336', bgcolor: 'rgba(244, 67, 54, 0.1)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' } }}
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('hr.edit_permissions')}>
                      <IconButton 
                        size="small" 
                        onClick={() => setEditUser(user)}
                        sx={{ color: 'var(--color-primary)', bgcolor: 'rgba(212, 175, 55, 0.1)', '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.2)' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No employees found matching your search.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Staff Profile</DialogTitle>
        <DialogContent dividers>
          {viewUser && (
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Typography><strong>User ID:</strong> {viewUser.userId || "-"}</Typography>
              <Typography><strong>Username:</strong> {viewUser.username || "-"}</Typography>
              <Typography><strong>Email:</strong> {viewUser.email || "-"}</Typography>
              <Typography><strong>Full name:</strong> {`${viewUser.firstName || ""} ${viewUser.lastName || ""}`.trim() || "-"}</Typography>
              <Typography><strong>Phone:</strong> {viewUser.phoneNumber || "-"}</Typography>
              <Typography><strong>Status:</strong> {viewUser.accountEnabled === false ? "Locked" : "Active"}</Typography>
              <Typography><strong>Groups:</strong> {(viewUser.groups || []).join(", ") || "-"}</Typography>
              <Typography><strong>Roles:</strong> {(viewUser.roles || []).join(", ") || "-"}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <UserEditModal 
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        user={editUser}
        onSave={handleSavePermissions}
        availableRoles={rolesList}
        availableGroups={groupsList}
      />

      <UserCreationModal 
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateStaff}
        groups={groupsList}
      />

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
