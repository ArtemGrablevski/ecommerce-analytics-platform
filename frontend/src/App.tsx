import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IconButton, Box } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme';
import ComprehensiveDashboard from './components/ComprehensiveDashboard';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { adminApi } from './services/adminApi';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setCurrentRoute(path);
      
      if (path.startsWith('/admin')) {
        const adminToken = adminApi.getAdminToken();
        setIsAdminAuthenticated(!!adminToken);
      } else {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);
      }
    };
    
    checkRoute();
    
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
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

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentRoute('/admin');
    window.history.pushState({}, '', '/admin');
  };

  const handleAdminLogout = () => {
    adminApi.removeAdminToken();
    setIsAdminAuthenticated(false);
    setCurrentRoute('/admin/login');
    window.history.pushState({}, '', '/admin/login');
  };

  const navigateToAdmin = () => {
    setCurrentRoute('/admin/login');
    window.history.pushState({}, '', '/admin/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const renderContent = () => {
    // Admin routes
    if (currentRoute.startsWith('/admin')) {
      if (currentRoute === '/admin/login') {
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      } else if (currentRoute === '/admin' && isAdminAuthenticated) {
        return <AdminDashboard onLogout={handleAdminLogout} />;
      } else {
        // Redirect to admin login if not authenticated
        if (currentRoute !== '/admin/login') {
          setCurrentRoute('/admin/login');
          window.history.pushState({}, '', '/admin/login');
        }
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      }
    }
    
    // Regular user routes
    if (isAuthenticated) {
      return <ComprehensiveDashboard onLogout={handleLogout} onNavigateToAdmin={navigateToAdmin} />;
    } else {
      return <Login onLoginSuccess={handleLoginSuccess} onNavigateToAdmin={navigateToAdmin} />;
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {(isAuthenticated || isAdminAuthenticated) && !currentRoute.includes('/login') && (
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
        
        {renderContent()}
      </Box>
    </ThemeProvider>
  );
}

export default App;
