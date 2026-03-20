import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartCardProps {
  title: string;
  data: any[];
  dataKey: string;
  nameKey: string;
}

const COLORS = ['#6366F1', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981'];

const PieChartCard: React.FC<PieChartCardProps> = ({ title, data, dataKey, nameKey }) => {
  const theme = useTheme();
  
  // Защита от невалидных данных
  const validData = Array.isArray(data) ? data : [];
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            background: theme.palette.background.paper,
            border: 'none',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            minWidth: 120
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 600,
              mb: 0.5
            }}
          >
            {data.payload[nameKey]}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: data.color,
              fontWeight: 600
            }}
          >
            {data.value}
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card sx={{ minWidth: 400, minHeight: 480 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2
          }}
        >
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 360, display: 'flex', flexDirection: 'column' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={validData}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={35}
                fill="#8884d8"
                stroke="none"
                paddingAngle={2}
              >
                {validData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '14px',
                  color: theme.palette.text.secondary,
                  lineHeight: '1.8'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;