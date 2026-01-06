import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color = '#1976d2' }) => {
  return (
    <Card sx={{ minWidth: 200, height: 120 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ color, fontWeight: 'bold' }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;