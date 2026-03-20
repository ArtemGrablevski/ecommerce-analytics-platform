import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IconButton, Box } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme';
import ComprehensiveDashboard from './components/ComprehensiveDashboard';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {isAuthenticated && (
          <IconButton
            onClick={toggleTheme}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              backgroundColor: currentTheme.palette.background.paper,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: currentTheme.palette.background.paper,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isDarkMode ? (
              <LightMode sx={{ color: currentTheme.palette.primary.main }} />
            ) : (
              <DarkMode sx={{ color: currentTheme.palette.primary.main }} />
            )}
          </IconButton>
        )}
        
        {isAuthenticated ? (
          <ComprehensiveDashboard onLogout={handleLogout} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
