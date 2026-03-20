import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Legend
} from 'recharts';

interface ChartCardProps {
  title: string;
  data: any[];
  type: 'bar' | 'line' | 'multiLine';
  xDataKey: string;
  yDataKey?: string;
  lines?: Array<{ dataKey: string; stroke: string; name: string }>;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, type, xDataKey, yDataKey, lines }) => {
  const theme = useTheme();
  
  // Защита от невалидных данных
  const validData = Array.isArray(data) ? data : [];
  
  const chartColors = ['#6366F1', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981'];
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography 
              key={index}
              variant="body2" 
              sx={{ 
                color: entry.color,
                fontWeight: 600
              }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ minWidth: 400, minHeight: 380 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {type === 'bar' ? (
              <BarChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis 
                  dataKey={xDataKey} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                />
                <Tooltip content={customTooltip} />
                <Bar 
                  dataKey={yDataKey} 
                  fill={chartColors[0]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : type === 'multiLine' ? (
              <LineChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                  opacity={0.1}
                />
                <XAxis 
                  dataKey={xDataKey} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                />
                <Tooltip content={customTooltip} />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                />
                {lines?.map((line, index) => (
                  <Line 
                    key={line.dataKey}
                    type="monotone" 
                    dataKey={line.dataKey} 
                    stroke={chartColors[index % chartColors.length]} 
                    strokeWidth={3}
                    name={line.name}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: chartColors[index % chartColors.length], strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            ) : (
              <LineChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                  opacity={0.1}
                />
                <XAxis 
                  dataKey={xDataKey} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                />
                <Tooltip content={customTooltip} />
                <Line 
                  type="monotone" 
                  dataKey={yDataKey} 
                  stroke={chartColors[0]} 
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartColors[0] }}
                  activeDot={{ r: 6, stroke: chartColors[0], strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;