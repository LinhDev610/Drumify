import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import './App.css';
import AppRoutes from './routes/routes';
import { useThemeStatus } from './context/ThemeContext';

function App() {
  const { isDarkMode } = useThemeStatus();

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#d4af37', // Accent gold
      },
      secondary: {
        main: '#d32f2f', // Drumify red
      },
      background: {
        default: isDarkMode ? '#0a0a0b' : '#f8f9fa',
        paper: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#1a1a1a',
        secondary: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      }
    },
    typography: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
    },
    shape: {
      borderRadius: 12,
    }
  }), [isDarkMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline/>
      <AppRoutes/>
    </ThemeProvider>
  );
}

export default App;
