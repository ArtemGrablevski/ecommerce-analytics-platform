import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  IconButton,
  Avatar,
  Typography,
  InputAdornment,
  useTheme,
  Button,
} from '@mui/material';
import {
  Search,
  Notifications,
  Settings,
  Logout,
  PictureAsPdf,
} from '@mui/icons-material';

interface TopBarProps {
  onLogout: () => void;
  partnerName?: string;
  onExportPDF?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout, partnerName = 'Partner', onExportPDF }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        mb: 3,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Analytics
          </Typography>
          
          <TextField
            placeholder="Search metrics..."
            size="small"
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#334155',
                border: 'none',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: `2px solid ${theme.palette.primary.main}`,
                  },
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              p: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#334155',
              },
            }}
          >
            <Notifications sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          </IconButton>

          <IconButton
            onClick={onExportPDF}
            sx={{
              p: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#334155',
              },
            }}
          >
            <PictureAsPdf sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          </IconButton>

          <IconButton
            sx={{
              p: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#334155',
              },
            }}
          >
            <Settings sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                }}
              >
                {partnerName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                }}
              >
                Partner Account
              </Typography>
            </Box>
            
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {partnerName.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          <Button
            onClick={onLogout}
            variant="outlined"
            size="small"
            startIcon={<Logout sx={{ fontSize: 16 }} />}
            sx={{
              ml: 1,
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              borderRadius: 2,
              px: 2,
              py: 1,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                backgroundColor: 'transparent',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;