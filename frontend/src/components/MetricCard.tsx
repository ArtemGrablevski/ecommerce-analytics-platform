import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  gradient?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  gradient,
  trend,
  icon
}) => {
  const theme = useTheme();
  
  const cardGradient = gradient || 
    (theme.palette.mode === 'light' ? 
      'linear-gradient(135deg, #6366F1, #06B6D4)' : 
      'linear-gradient(135deg, #6366F1, #06B6D4)');

  return (
    <Card 
      sx={{ 
        minWidth: 280,
        height: 140,
        background: cardGradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          borderRadius: '50% 0 0 50%',
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box sx={{ opacity: 0.7 }}>
              {icon}
            </Box>
          )}
        </Box>
        
        <Box>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              fontSize: '2.25rem',
              lineHeight: 1,
              mb: trend ? 1 : 0
            }}
          >
            {value}
          </Typography>
          
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend.direction === 'up' ? (
                <TrendingUp sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {trend.value}%
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;