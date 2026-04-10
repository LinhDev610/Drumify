import * as React from "react";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";

const linkStyle = ({ isActive }) => ({
  fontWeight: isActive ? 700 : 500,
});

const items = [
  { to: "/", label: "Home", icon: <HomeIcon />, end: true },
  { to: "/products", label: "Products", icon: <Inventory2Icon /> },
  { to: "/cart", label: "Cart", icon: <ShoppingCartIcon /> },
  { to: "/checkout", label: "Checkout", icon: <PaymentIcon /> },
  { to: "/profile", label: "Profile", icon: <PersonIcon /> },
];

function SideMenu() {
  return (
    <>
      <Toolbar />
      <List>
        {items.map(({ to, label, icon, end }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton component={NavLink} to={to} end={end} sx={linkStyle}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
}

export default SideMenu;
