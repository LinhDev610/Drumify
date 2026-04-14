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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContentText
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SecurityIcon from "@mui/icons-material/Security";
import GroupsIcon from "@mui/icons-material/Groups";

export default function UserEditModal({ open, onClose, user, onSave, availableRoles = [], availableGroups = [] }) {
  const { t } = useTranslation();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [groupToRemove, setGroupToRemove] = useState(null);
  const [groupToAdd, setGroupToAdd] = useState("");

  useEffect(() => {
    if (user) {
      const userRoles = availableRoles.filter(r => user.roles?.includes(r.name) || user.roles?.includes(r.id));
      const userGroups = availableGroups.filter(g => user.groups?.includes(g.name) || user.groups?.includes(g.path) || user.groups?.includes(g.id));
      
      setSelectedRoles(userRoles);
      setSelectedGroups(userGroups);
    }
  }, [user, availableRoles, availableGroups]);

  const handleToggleRole = (roleItem) => {
    setSelectedRoles((prev) =>
      prev.find(r => r.id === roleItem.id) ? prev.filter((r) => r.id !== roleItem.id) : [...prev, roleItem]
    );
  };

  const handleRemoveClick = (groupItem) => {
    setGroupToRemove(groupItem);
    setConfirmRemoveOpen(true);
  };

  const confirmRemoveGroup = () => {
    setSelectedGroups((prev) => prev.filter((g) => g.id !== groupToRemove.id));
    setConfirmRemoveOpen(false);
    setGroupToRemove(null);
  };

  const handleAddGroup = () => {
    if (groupToAdd) {
      const fullGroup = availableGroups.find(g => g.id === groupToAdd);
      if (fullGroup && !selectedGroups.find(g => g.id === fullGroup.id)) {
        setSelectedGroups(prev => [...prev, fullGroup]);
      }
      setGroupToAdd("");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const groupIds = selectedGroups.map(g => g.id);
      await onSave(user.id, selectedRoles, groupIds);
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
            {availableRoles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={!!selectedRoles.find(r => r.id === role.id)}
                    onChange={() => handleToggleRole(role)}
                    size="small"
                  />
                }
                label={<Chip label={role.name} size="small" variant="outlined" sx={{ cursor: 'pointer' }} />}
                sx={{ minWidth: '45%' }}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <GroupsIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t('hr.groups_title')}
            </Typography>
          </Box>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Current Group(s):
            </Typography>
            {selectedGroups.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                The user does not belong to any groups.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedGroups.map((group) => (
                  <Chip 
                    key={group.id} 
                    label={group.name} 
                    color="primary" 
                    variant="outlined" 
                    onDelete={() => handleRemoveClick(group)} 
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Assign new group</InputLabel>
              <Select
                value={groupToAdd}
                onChange={(e) => setGroupToAdd(e.target.value)}
                label="Assign new group"
              >
                {availableGroups.filter(ag => !selectedGroups.find(sg => sg.id === ag.id)).map(group => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
                {availableGroups.filter(ag => !selectedGroups.find(sg => sg.id === ag.id)).length === 0 && (
                  <MenuItem disabled value="">
                    No remaining groups
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              onClick={handleAddGroup}
              disabled={!groupToAdd}
            >
              Add
            </Button>
          </Box>
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

      {/* Confirmation Dialog for Group Removal */}
      <Dialog open={confirmRemoveOpen} onClose={() => setConfirmRemoveOpen(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the user from the group <strong>{groupToRemove?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)}>Cancel</Button>
          <Button onClick={confirmRemoveGroup} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>


  );
}
