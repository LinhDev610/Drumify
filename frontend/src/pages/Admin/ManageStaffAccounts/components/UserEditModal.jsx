import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SecurityIcon from "@mui/icons-material/Security";
import GroupsIcon from "@mui/icons-material/Groups";

const ROLES = ["ADMIN", "CUSTOMER", "DIRECTOR", "STAFF"];
const GROUPS = ["CASHIER", "CS", "HR", "MARKETING", "WAREHOUSE"];

export default function UserEditModal({ open, onClose, user, onSave }) {
  const { t } = useTranslation();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles || []);
      setSelectedGroups(user.groups || []);
    }
  }, [user]);

  const handleToggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleToggleGroup = (group) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(user.id, selectedRoles, selectedGroups);
      onClose();
    } catch (error) {
      console.error("Failed to save permissions", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--color-bg-deep)',
          backgroundImage: 'none',
          border: '1px solid var(--color-border)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid var(--color-border)', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SecurityIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('hr.edit_permissions')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              User: {user.username} ({user.email})
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <GroupsIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t('hr.roles_title')}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            {t('hr.assign_roles_desc')}
          </Typography>
          <FormGroup row>
            {ROLES.map((role) => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleToggleRole(role)}
                    size="small"
                  />
                }
                label={<Chip label={role} size="small" variant="outlined" sx={{ cursor: 'pointer' }} />}
                sx={{ minWidth: '45%' }}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <GroupsIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t('hr.groups_title')}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            {t('hr.assign_groups_desc')}
          </Typography>
          <FormGroup row>
            {GROUPS.map((group) => (
              <FormControlLabel
                key={group}
                control={
                  <Checkbox
                    checked={selectedGroups.includes(group)}
                    onChange={() => handleToggleGroup(group)}
                    size="small"
                  />
                }
                label={<Chip label={group} size="small" variant="outlined" sx={{ cursor: 'pointer' }} />}
                sx={{ minWidth: '45%' }}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid var(--color-border)' }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: 2 }}>
          {t('profile.general.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{ borderRadius: 2, px: 4, position: 'relative' }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            t('hr.save_permissions')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
