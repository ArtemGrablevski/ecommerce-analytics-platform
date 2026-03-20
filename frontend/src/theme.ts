import { createTheme, ThemeOptions } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#8B87FF',
      dark: '#4338CA',
    },
    secondary: {
      main: '#06B6D4',
      light: '#67E8F9',
      dark: '#0891B2',
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    background: {
      default: '#F5F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    divider: 'rgba(0,0,0,0.05)',
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#6B7280',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.05)',
    '0 4px 6px rgba(0,0,0,0.05)',
    '0 10px 15px rgba(0,0,0,0.08)',
    '0 20px 25px rgba(0,0,0,0.08)',
    '0 25px 50px rgba(0,0,0,0.10)',
    ...Array(19).fill('0 25px 50px rgba(0,0,0,0.10)'),
  ] as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#8B87FF',
      dark: '#4338CA',
    },
    secondary: {
      main: '#06B6D4',
      light: '#67E8F9',
      dark: '#0891B2',
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#94A3B8',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.2)',
    '0 4px 6px rgba(0,0,0,0.2)',
    '0 10px 15px rgba(0,0,0,0.3)',
    '0 20px 25px rgba(0,0,0,0.3)',
    '0 25px 50px rgba(0,0,0,0.4)',
    ...Array(19).fill('0 25px 50px rgba(0,0,0,0.4)'),
  ] as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
          },
        },
      },
    },
  },
});

export const customColors = {
  light: {
    gradients: {
      primary: 'linear-gradient(135deg, #6366F1, #06B6D4)',
      success: 'linear-gradient(135deg, #22C55E, #06B6D4)',
      warning: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      info: 'linear-gradient(135deg, #06B6D4, #6366F1)',
    },
    chart: {
      colors: ['#6366F1', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981'],
    },
  },
  dark: {
    gradients: {
      primary: 'linear-gradient(135deg, #6366F1, #06B6D4)',
      success: 'linear-gradient(135deg, #22C55E, #06B6D4)',
      warning: 'linear-gradient(135deg, #F59E0B, #EF4444)',
      info: 'linear-gradient(135deg, #06B6D4, #6366F1)',
    },
    chart: {
      colors: ['#6366F1', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981'],
    },
  },
};