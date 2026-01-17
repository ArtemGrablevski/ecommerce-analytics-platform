import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Timeline,
  Assessment,
  Visibility
} from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { dashboardApi } from '../services/api';
import ChartCard from './ChartCard';
import DataTable from './DataTable';
import PieChartCard from './PieChartCard';

const ComprehensiveDashboard: React.FC = () => {
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
    return metric && metric[field] !== undefined ? metric[field] : 'N/A';
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

  const topPagesColumns: GridColDef[] = [
    { field: 'page', headerName: 'Page', flex: 1, minWidth: 120 },
    { field: 'views', headerName: 'Views', flex: 0.5, minWidth: 80, type: 'number' },
  ];

  const searchColumns: GridColDef[] = [
    { field: 'query', headerName: 'Search query', flex: 1, minWidth: 120 },
    { field: 'search_count', headerName: 'Count', flex: 0.5, minWidth: 80, type: 'number' },
  ];

  const clickedElementsColumns: GridColDef[] = [
    { field: 'element_name', headerName: 'Element', flex: 1, minWidth: 120 },
    { field: 'clicks', headerName: 'Clicks', flex: 0.5, minWidth: 80, type: 'number' },
  ];

  const filterUsageColumns: GridColDef[] = [
    { field: 'filter_name', headerName: 'Filter name', flex: 1, minWidth: 100 },
    { field: 'filter_value', headerName: 'Filter value', flex: 1, minWidth: 100 },
    { field: 'usage_count', headerName: 'Usage', flex: 0.7, minWidth: 80, type: 'number' },
  ];

  const productsColumns: GridColDef[] = [
    { field: 'product_id', headerName: 'Product ID', flex: 1, minWidth: 100 },
    { field: 'cart_additions', headerName: 'Cart adds', flex: 0.8, minWidth: 80, type: 'number' },
    { field: 'unique_users', headerName: 'Unique users', flex: 0.8, minWidth: 80, type: 'number' },
  ];

  const activityColumns: GridColDef[] = [
    { field: 'hour', headerName: 'Hour', flex: 1, minWidth: 80, type: 'number' },
    { field: 'events', headerName: 'Events', flex: 1, minWidth: 80, type: 'number' },
  ];

  const currencyColumns: GridColDef[] = [
    { field: 'currency', headerName: 'Currency', flex: 0.8, minWidth: 80 },
    { field: 'transactions', headerName: 'Transactions', flex: 1, minWidth: 90, type: 'number' },
    { field: 'total_amount', headerName: 'Total amount', flex: 1, minWidth: 100, type: 'number' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      pt: 0,
      pb: 6
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          mb: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 0,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          p: { xs: 3, md: 6 },
          pt: { xs: 4, md: 8 },
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Analytics dashboard
            </Typography>
          </Box>
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            zIndex: 0
          }} />
        </Box>

        <Box sx={{ mb: 8, px: { xs: 2, md: 0 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}>
                <People sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              User metrics
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3
          }}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Daily active users</Typography>
                  <People sx={{ opacity: 0.9 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatNumber(getMetricValue('daily_active_users'))}
                </Typography>
                <Chip size="small" label="Today" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Weekly active users</Typography>
                  <Timeline sx={{ opacity: 0.9 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatNumber(getMetricValue('weekly_active_users'))}
                </Typography>
                <Chip size="small" label="7 Days" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Monthly active users</Typography>
                  <Assessment sx={{ opacity: 0.9 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatNumber(getMetricValue('monthly_active_users'))}
                </Typography>
                <Chip size="small" label="30 Days" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              borderRadius: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>New registrations</Typography>
                  <TrendingUp sx={{ opacity: 0.9 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatNumber(getMetricValue('new_registrations_today'))}
                </Typography>
                <Chip size="small" label="Today" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ mb: 8, px: { xs: 2, md: 0 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}>
                <AttachMoney sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              Revenue metrics
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3
          }}>
            <Card sx={{ 
              height: '100%',
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-8px)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Daily Revenue</Typography>
                  <Box sx={{ 
                    backgroundColor: '#dcfce7', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex'
                  }}>
                    <AttachMoney sx={{ color: '#16a34a', fontSize: 20 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#16a34a', mb: 1 }}>
                  {formatCurrency(getMetricValue('daily_revenue'))}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: '#16a34a', fontSize: 16 }} />
                  <Typography variant="body2" color="#16a34a">+0% vs yesterday</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%',
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-8px)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Average Order Value</Typography>
                  <Box sx={{ 
                    backgroundColor: '#dbeafe', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex'
                  }}>
                    <ShoppingCart sx={{ color: '#2563eb', fontSize: 20 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563eb', mb: 1 }}>
                  {formatCurrency(getMetricValue('average_order_value'))}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: '#16a34a', fontSize: 16 }} />
                  <Typography variant="body2" color="#16a34a">7-day average</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%',
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-8px)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">ARPU (7 days)</Typography>
                  <Box sx={{ 
                    backgroundColor: '#fef3c7', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex'
                  }}>
                    <People sx={{ color: '#d97706', fontSize: 20 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706', mb: 1 }}>
                  {formatCurrency(getMetricValue('arpu_7_days'))}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: '#16a34a', fontSize: 16 }} />
                  <Typography variant="body2" color="#16a34a">Revenue per user</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%',
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-8px)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Transactions Today</Typography>
                  <Box sx={{ 
                    backgroundColor: '#f3e8ff', 
                    borderRadius: '50%', 
                    p: 1,
                    display: 'flex'
                  }}>
                    <Assessment sx={{ color: '#9333ea', fontSize: 20 }} />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#9333ea', mb: 1 }}>
                  {formatNumber(getMetricValue('total_transactions_today'))}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: '#16a34a', fontSize: 16 }} />
                  <Typography variant="body2" color="#16a34a">Today's count</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ mb: 8, px: { xs: 2, md: 0 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}>
                <Timeline sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              Trends & analysis
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: 3
          }}>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Revenue Trend (30 days)
                </Typography>
                <ChartCard
                  title=""
                  data={metrics.revenue_trend_30_days?.points || []}
                  type="line"
                  xDataKey="date"
                  yDataKey="revenue"
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  User Activity Trend (30 days)
                </Typography>
                <ChartCard
                  title=""
                  data={metrics.user_activity_trend_30_days?.points || []}
                  type="line"
                  xDataKey="date"
                  yDataKey="active_users"
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Registration Trend
                </Typography>
                <ChartCard
                  title=""
                  data={metrics.user_registration_trend?.points || []}
                  type="line"
                  xDataKey="date"
                  yDataKey="registrations"
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Daily Activity Trend
                </Typography>
                <ChartCard
                  title=""
                  data={metrics.daily_activity_trend?.points || []}
                  type="bar"
                  xDataKey="time"
                  yDataKey="events"
                />
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ mb: 8, px: { xs: 2, md: 0 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}>
                <ShoppingCart sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              User journey & conversion
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3
          }}>
            <Card sx={{ 
              height: 450,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  User Journey Funnel
                </Typography>
                <ChartCard
                  title=""
                  data={metrics.user_journey_funnel?.points || []}
                  type="multiLine"
                  xDataKey="time"
                  lines={[
                    { dataKey: 'page_views', stroke: '#1976d2', name: 'Page Views' },
                    { dataKey: 'searches', stroke: '#388e3c', name: 'Searches' },
                    { dataKey: 'cart_additions', stroke: '#f57c00', name: 'Cart Additions' }
                  ]}
                />
              </CardContent>
            </Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: 450 }}>
              <Card sx={{ 
                flex: 1,
                border: '1px solid #fecaca',
                borderRadius: 3,
                backgroundColor: '#fef2f2',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Cart abandonment</Typography>
                    <TrendingDown sx={{ color: '#dc2626', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#dc2626', mb: 2 }}>
                    {formatPercentage(getMetricValue('cart_abandonment_rate'))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Carts not converted</Typography>
                </CardContent>
              </Card>
              <Card sx={{ 
                flex: 1,
                border: '1px solid #bbf7d0',
                borderRadius: 3,
                backgroundColor: '#f0fdf4',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Conversion rate</Typography>
                    <TrendingUp sx={{ color: '#16a34a', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#16a34a', mb: 2 }}>
                    {formatPercentage(getMetricValue('conversion_rate_cart_to_purchase'))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Cart to purchase</Typography>
                </CardContent>
              </Card>
              <Card sx={{ 
                flex: 1,
                border: '1px solid #c7d2fe',
                borderRadius: 3,
                backgroundColor: '#f0f4ff',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Engagement score</Typography>
                    <Visibility sx={{ color: '#4f46e5', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#4f46e5', mb: 2 }}>
                    {formatNumber(getMetricValue('user_engagement_score'))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Events per user</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 8, px: { xs: 2, md: 0 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}>
                <Visibility sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              Content & interaction analytics
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3
          }}>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Top Pages by Views
                </Typography>
                <DataTable
                  title=""
                  data={metrics.top_pages_by_views?.rows || []}
                  columns={topPagesColumns}
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Search Queries
                </Typography>
                <DataTable
                  title=""
                  data={metrics.search_queries?.rows || []}
                  columns={searchColumns}
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#334155' }}>
                  Event type distribution
                </Typography>
                <PieChartCard
                  title=""
                  data={metrics.event_type_distribution?.rows || []}
                  dataKey="value"
                  nameKey="event_type"
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              gridColumn: { lg: 'span 2' },
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Most Clicked Elements
                </Typography>
                <DataTable
                  title=""
                  data={metrics.most_clicked_elements?.rows || []}
                  columns={clickedElementsColumns}
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Activity by Hour
                </Typography>
                <DataTable
                  title=""
                  data={metrics.activity_by_hour?.rows || []}
                  columns={activityColumns}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ mb: 8, px: { xs: 2, md: 0 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}>
                <Assessment sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              Business insights
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3
          }}>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Top Performing Products
                </Typography>
                <DataTable
                  title=""
                  data={metrics.top_performing_products?.rows || []}
                  columns={productsColumns}
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Filter Usage
                </Typography>
                <DataTable
                  title=""
                  data={metrics.filter_usage?.rows || []}
                  columns={filterUsageColumns}
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Currency Transactions
                </Typography>
                <ChartCard
                  title=""
                  data={metrics.transaction_volume_by_currency?.rows || []}
                  type="bar"
                  xDataKey="currency"
                  yDataKey="transactions"
                />
              </CardContent>
            </Card>
            <Card sx={{ 
              minHeight: 480,
              gridColumn: { lg: 'span 2' },
              border: 'none',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#334155' }}>
                  Transaction Volume by Currency
                </Typography>
                <DataTable
                  title=""
                  data={metrics.transaction_volume_by_currency?.rows || []}
                  columns={currencyColumns}
                />
              </CardContent>
            </Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: 400 }}>
              <Card sx={{ 
                flex: 1,
                border: 'none',
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                  transform: 'translateY(-6px)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Most Active Event</Typography>
                    <Box sx={{ 
                      backgroundColor: '#e0f2f1', 
                      borderRadius: '50%', 
                      p: 1,
                      display: 'flex'
                    }}>
                      <Assessment sx={{ color: '#00796b', fontSize: 20 }} />
                    </Box>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#00796b', mb: 1 }}>
                    {getMetricValue('most_active_event_type') || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Top event type</Typography>
                </CardContent>
              </Card>
              <Card sx={{ 
                flex: 1,
                border: 'none',
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                  transform: 'translateY(-6px)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Page Views</Typography>
                    <Box sx={{ 
                      backgroundColor: '#fbe9e7', 
                      borderRadius: '50%', 
                      p: 1,
                      display: 'flex'
                    }}>
                      <Visibility sx={{ color: '#5d4037', fontSize: 20 }} />
                    </Box>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#5d4037', mb: 1 }}>
                    {formatNumber(getMetricValue('total_page_views'))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">7-day total</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ComprehensiveDashboard;