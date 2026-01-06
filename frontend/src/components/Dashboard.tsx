import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { dashboardApi } from '../services/api';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getAllMetrics();
        setMetrics(response.metrics);
      } catch (err) {
        setError('Failed to fetch dashboard metrics');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const getMetricValue = (metricName: string, field: string = 'value') => {
    const metric = metrics[metricName];
    return metric && metric[0] ? metric[0][field] : 'N/A';
  };

  const formatNumber = (value: any) => {
    if (value === 'N/A' || !value) return 'N/A';
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toLocaleString();
  };

  const formatCurrency = (value: any) => {
    if (value === 'N/A' || !value) return 'N/A';
    const num = parseFloat(value);
    return isNaN(num) ? value : `$${num.toLocaleString()}`;
  };

  const formatPercentage = (value: any) => {
    if (value === 'N/A' || !value) return 'N/A';
    const num = parseFloat(value);
    return isNaN(num) ? value : `${num.toFixed(2)}%`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Box>
        <Box>
          <MetricCard
            title="Total Users"
            value={formatNumber(getMetricValue('total_users'))}
            color="#1976d2"
          />
        </Box>
        
        <Box>
          <MetricCard
            title="Total Transactions"
            value={formatNumber(getMetricValue('total_transactions'))}
            color="#388e3c"
          />
        </Box>
        
        <Box>
          <MetricCard
            title="Revenue"
            value={formatCurrency(getMetricValue('revenue'))}
            color="#f57c00"
          />
        </Box>
        
        <Box>
          <MetricCard
            title="Conversion Rate"
            value={formatPercentage(getMetricValue('conversion_rate'))}
            color="#7b1fa2"
          />
        </Box>

        <Box>
          <ChartCard
            title="Popular Pages"
            data={metrics.popular_pages || []}
            type="bar"
            xDataKey="page_url"
            yDataKey="views"
          />
        </Box>

        <Box>
          <ChartCard
            title="Search Trends"
            data={metrics.search_trends || []}
            type="bar"
            xDataKey="search_query"
            yDataKey="frequency"
          />
        </Box>

        <Box>
          <MetricCard
            title="Cart Abandonment Rate"
            value={formatPercentage(getMetricValue('cart_abandonment'))}
            color="#d32f2f"
          />
        </Box>

        <Box>
          <ChartCard
            title="User Activity (Last 30 Days)"
            data={metrics.user_activity || []}
            type="line"
            xDataKey="date"
            yDataKey="active_users"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;