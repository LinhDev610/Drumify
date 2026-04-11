import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Header from "../component/Header";
import CategoryGrid from "../component/CategoryGrid/CategoryGrid";

function Scene({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh' }}>
      {/* Main Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'rgba(26, 26, 26, 0.98)', // More solid to prevent blur bleeding
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          willChange: 'transform',
        }}
      >
        <Toolbar>
           <Header />
        </Toolbar>
      </AppBar>

      {/* Sub-Header: Functional Category Navigation */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(255, 255, 255, 0.92)', // More solid background
          backdropFilter: 'blur(8px)', // Reduced from 20px to fix blurriness
          top: 64, // Height of standard AppBar
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          color: '#333',
          display: { xs: 'none', lg: 'block' }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar variant="dense" sx={{ minHeight: 48, justifyContent: 'center' }}>
             <CategoryGrid />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          bgcolor: '#fafafa',
          pt: { xs: '64px', lg: '112px' }, // Header (64) + SubHeader (48)
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Scene;
