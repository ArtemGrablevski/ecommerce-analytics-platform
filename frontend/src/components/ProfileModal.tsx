import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person,
  Schedule,
  Verified,
  Block,
} from '@mui/icons-material';

interface PartnerProfile {
  id: string;
  name: string;
  is_banned: boolean;
  active_until: string | null;
}

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: PartnerProfile | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, profile }) => {
  const theme = useTheme();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unlimited';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const isActive = profile && !profile.is_banned && (
    !profile.active_until || new Date(profile.active_until) > new Date()
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person
            sx={{
              fontSize: 28,
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Profile information
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {profile && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Partner Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {profile.name}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Account Status
              </Typography>
              <Chip
                label={isActive ? 'Active' : profile.is_banned ? 'Banned' : 'Expired'}
                color={isActive ? 'success' : 'error'}
                icon={isActive ? <Verified /> : <Block />}
                sx={{ 
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    fontSize: 18,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule sx={{ fontSize: 16 }} />
                  Subscription Valid Until
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(profile.active_until)}
              </Typography>
              {profile.active_until && new Date(profile.active_until) <= new Date() && (
                <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>
                  Subscription has expired
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Partner ID
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.85rem',
                  color: theme.palette.text.secondary,
                  wordBreak: 'break-all',
                }}
              >
                {profile.id}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;