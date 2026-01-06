import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
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
  return (
    <Card sx={{ minWidth: 400, minHeight: 350 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            {type === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xDataKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={yDataKey} fill="#1976d2" />
              </BarChart>
            ) : type === 'multiLine' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xDataKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {lines?.map((line) => (
                  <Line 
                    key={line.dataKey}
                    type="monotone" 
                    dataKey={line.dataKey} 
                    stroke={line.stroke} 
                    strokeWidth={2}
                    name={line.name}
                  />
                ))}
              </LineChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xDataKey} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={yDataKey} stroke="#1976d2" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;