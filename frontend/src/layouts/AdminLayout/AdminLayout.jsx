import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: '100vh', bgcolor: 'var(--color-bg-deep)' }}>
      <CssBaseline />
      
      <Sidebar />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: { sm: `calc(100% - 280px)` } 
        }}
      >
        <TopNav />
        
        <Box 
          sx={{ 
            p: 4, 
            flexGrow: 1, 
            bgcolor: 'transparent',
            color: 'var(--color-text-main)' 
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
