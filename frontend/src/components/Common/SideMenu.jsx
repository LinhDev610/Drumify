import * as React from "react";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";

const linkStyle = ({ isActive }) => ({
  fontWeight: isActive ? 700 : 500,
  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
  bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
  borderRadius: '8px',
  mx: 1,
  mb: 0.5,
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.05)',
  }
});

const items = [
  { to: "/", label: "Home", icon: <HomeIcon />, end: true },
  { to: "/products", label: "Products", icon: <Inventory2Icon /> },
  { to: "/cart", label: "Cart", icon: <ShoppingCartIcon /> },
  { to: "/checkout", label: "Checkout", icon: <PaymentIcon /> },
  { to: "/profile", label: "Profile", icon: <PersonIcon /> },
];

function SideMenu({ onClose }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
       <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: [1] }}>
        <Typography variant="h6" sx={{ fontWeight: 800, ml: 1, color: '#fff' }}>
          NAVIGATION
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ mt: 2 }}>
        {items.map(({ to, label, icon, end }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton 
              component={NavLink} 
              to={to} 
              end={end} 
              sx={linkStyle}
              onClick={onClose}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
         <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
           © 2026 Drumify Music Store
         </Typography>
      </Box>
    </Box>
  );
}

export default SideMenu;
