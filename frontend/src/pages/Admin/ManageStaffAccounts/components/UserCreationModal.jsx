import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function UserCreationModal({ open, onClose, onSave, groups }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    groupId: ""
  });
  
  useEffect(() => {
    if (open && groups && groups.length > 0) {
      const staffGroup = groups.find(g => g.name === "STAFF" || g.path === "/STAFF");
      if (staffGroup) {
        setFormData(prev => ({ ...prev, groupId: staffGroup.id }));
      } else {
        setFormData(prev => ({ ...prev, groupId: groups[0].id }));
      }
    }
  }, [open, groups]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ ...formData, password: "112233" });
      setFormData({ username: "", email: "", password: "", firstName: "", lastName: "", groupId: "" }); // Reset
    } catch (error) {
      console.error("Failed to create staff", error);
    } finally {
      setLoading(false);
    }
  };

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
          <PersonAddIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Create Staff Account
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Assign a new staff to the HR directory
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              name="groupId"
              label="Assign Group"
              fullWidth
              value={formData.groupId}
              onChange={handleChange}
              variant="outlined"
            >
              {groups && groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid var(--color-border)' }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: 2 }}>
          {t('profile.general.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !formData.username || !formData.groupId}
          sx={{ borderRadius: 2, px: 4, position: 'relative' }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            "Create Account"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
