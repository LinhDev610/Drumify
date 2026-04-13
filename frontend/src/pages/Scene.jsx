import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Header from "../component/Header";
import CategoryGrid from "../component/CategoryGrid/CategoryGrid";
import { useLocation } from "react-router-dom";
import { useThemeStatus } from "../context/ThemeContext";

function Scene({ children }) {
  const { isDarkMode } = useThemeStatus();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh', bgcolor: 'var(--color-bg-deep)' }}>
      {/* Main Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'var(--color-glass)', 
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text-main)',
          willChange: 'transform',
        }}
      >
        <Toolbar>
           <Header />
        </Toolbar>
      </AppBar>

      {/* Sub-Header: Functional Category Navigation - ONLY ON HOME PAGE */}
      {isHomePage && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            backdropFilter: 'blur(10px)',
            top: 64,
            boxShadow: isDarkMode ? '0 4px 30px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
            borderBottom: '1px solid var(--color-border)',
            color: 'var(--color-text-main)',
            display: { xs: 'none', lg: 'block' }
          }}
        >
          <Container maxWidth="xl">
            <Toolbar variant="dense" sx={{ minHeight: 48, justifyContent: 'center' }}>
               <CategoryGrid />
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          bgcolor: 'transparent',
          pt: { 
            xs: '64px', 
            lg: isHomePage ? '112px' : '64px'
          }, 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Scene;
