import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  People,
  ShoppingCart,
  AttachMoney,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { dashboardApi } from '../services/api';
import { ExportService } from '../services/exportService';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import DataTable from './DataTable';
import PieChartCard from './PieChartCard';
import TopBar from './TopBar';
import ProfileModal from './ProfileModal';

interface ComprehensiveDashboardProps {
  onLogout: () => void;
  onNavigateToAdmin?: () => void;
}

const ComprehensiveDashboard: React.FC<ComprehensiveDashboardProps> = ({ onLogout, onNavigateToAdmin }) => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

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

  const handleOpenProfile = async () => {
    try {
      const profileData = await dashboardApi.getProfile();
      setProfile(profileData);
      setProfileOpen(true);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to fetch profile information');
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const result = await ExportService.exportToPDF(metrics);
      if (result.success) {
        console.log(`PDF exported successfully: ${result.fileName}`);
      } else {
        console.error('PDF export failed:', result.error);
      }
    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
        <TopBar onLogout={onLogout} onExportPDF={handleExportPDF} onNavigateToAdmin={onNavigateToAdmin} onOpenProfile={handleOpenProfile} />
        <Container sx={{ py: 4 }}>
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 3,
              border: 'none',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)'
            }}
          >
            {error}
          </Alert>
        </Container>
      </Box>
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
    { 
      field: 'page', 
      headerName: 'Page', 
      flex: 1, 
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'views', 
      headerName: 'Views', 
      flex: 0.5, 
      minWidth: 80, 
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          {formatNumber(params.value)}
        </Typography>
      ),
    },
  ];

  const searchQueriesColumns: GridColDef[] = [
    { 
      field: 'query', 
      headerName: 'Search Query', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'search_count', 
      headerName: 'Count', 
      flex: 0.5, 
      minWidth: 80, 
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
          {formatNumber(params.value)}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <TopBar onLogout={onLogout} onExportPDF={handleExportPDF} onNavigateToAdmin={onNavigateToAdmin} onOpenProfile={handleOpenProfile} />

      <Container maxWidth="xl" sx={{ py: 4 }} data-dashboard="main">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1
            }}
          >
            Analytics overview
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: '1.125rem'
            }}
          >
            Real-time insights and performance metrics
          </Typography>
        </Box>

        {/* Key Metrics Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <MetricCard
            title="Daily active users"
            value={formatNumber(getMetricValue('daily_active_users', 'value'))}
            gradient="linear-gradient(135deg, #6366F1, #8B5CF6)"
            icon={<People sx={{ fontSize: 24 }} />}
            trend={{ value: 12.5, direction: 'up' }}
          />

          <MetricCard
            title="Daily revenue"
            value={formatCurrency(getMetricValue('daily_revenue', 'value'))}
            gradient="linear-gradient(135deg, #22C55E, #06B6D4)"
            icon={<AttachMoney sx={{ fontSize: 24 }} />}
            trend={{ value: 8.2, direction: 'up' }}
          />

          <MetricCard
            title="Daily transactions"
            value={formatNumber(getMetricValue('total_transactions_today', 'value'))}
            gradient="linear-gradient(135deg, #F59E0B, #EF4444)"
            icon={<ShoppingCart sx={{ fontSize: 24 }} />}
            trend={{ value: 15.3, direction: 'up' }}
          />

          <MetricCard
            title="Average order value"
            value={formatCurrency(getMetricValue('average_order_value', 'value'))}
            gradient="linear-gradient(135deg, #06B6D4, #8B5CF6)"
            icon={<Timeline sx={{ fontSize: 24 }} />}
            trend={{ value: 3.7, direction: 'down' }}
          />
        </Box>

        {/* Charts Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          mb: 4
        }}>
          <ChartCard
            title="Revenue trend (30 days)"
            data={getMetricValue('revenue_trend_30_days', 'points') || []}
            type="line"
            xDataKey="date"
            yDataKey="revenue"
          />

          <PieChartCard
            title="Event distribution"
            data={getMetricValue('event_type_distribution', 'rows') || []}
            dataKey="value"
            nameKey="event_type"
          />
        </Box>

        {/* Tables Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <DataTable
            title="Top pages by views"
            data={getMetricValue('top_pages_by_views', 'rows') || []}
            columns={topPagesColumns}
          />

          <DataTable
            title="Search queries"
            data={getMetricValue('search_queries', 'rows') || []}
            columns={searchQueriesColumns}
          />
        </Box>

        {/* User Activity Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <ChartCard
            title="User activity trend (30 days)"
            data={getMetricValue('user_activity_trend_30_days', 'points') || []}
            type="line"
            xDataKey="date"
            yDataKey="active_users"
          />

          <ChartCard
            title="Transaction volume by currency"
            data={getMetricValue('transaction_volume_by_currency', 'rows') || []}
            type="bar"
            xDataKey="currency"
            yDataKey="transactions"
          />
        </Box>

        {/* Registration & Engagement Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          mb: 4
        }}>
          <ChartCard
            title="User registration trend"
            data={getMetricValue('user_registration_trend', 'points') || []}
            type="line"
            xDataKey="date"
            yDataKey="registrations"
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <MetricCard
              title="Cart abandonment"
              value={formatPercentage(getMetricValue('cart_abandonment_rate', 'value'))}
              gradient="linear-gradient(135deg, #EF4444, #DC2626)"
              icon={<ShoppingCart sx={{ fontSize: 24 }} />}
            />
            <MetricCard
              title="Engagement score"
              value={`${formatNumber(getMetricValue('user_engagement_score', 'value'))}/100`}
              gradient="linear-gradient(135deg, #22C55E, #16A34A)"
              icon={<Assessment sx={{ fontSize: 24 }} />}
            />
          </Box>
        </Box>

        {/* Additional Metrics Row 1 */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <MetricCard
            title="Weekly active users"
            value={formatNumber(getMetricValue('weekly_active_users', 'value'))}
            gradient="linear-gradient(135deg, #8B5CF6, #EC4899)"
            icon={<People sx={{ fontSize: 24 }} />}
          />

          <MetricCard
            title="Monthly active users"
            value={formatNumber(getMetricValue('monthly_active_users', 'value'))}
            gradient="linear-gradient(135deg, #10B981, #22C55E)"
            icon={<People sx={{ fontSize: 24 }} />}
          />

          <MetricCard
            title="New registrations"
            value={formatNumber(getMetricValue('new_registrations_today', 'value'))}
            gradient="linear-gradient(135deg, #F59E0B, #F97316)"
            icon={<People sx={{ fontSize: 24 }} />}
          />

          <MetricCard
            title="ARPU (7 days)"
            value={formatCurrency(getMetricValue('arpu_7_days', 'value'))}
            gradient="linear-gradient(135deg, #06B6D4, #0EA5E9)"
            icon={<AttachMoney sx={{ fontSize: 24 }} />}
          />
        </Box>

        {/* Additional Metrics Row 2 */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <MetricCard
            title="Total page views"
            value={formatNumber(getMetricValue('total_page_views', 'value'))}
            gradient="linear-gradient(135deg, #3B82F6, #1D4ED8)"
            icon={<People sx={{ fontSize: 24 }} />}
          />

          <MetricCard
            title="Cart conversion rate"
            value={formatPercentage(getMetricValue('conversion_rate_cart_to_purchase', 'value'))}
            gradient="linear-gradient(135deg, #059669, #047857)"
            icon={<ShoppingCart sx={{ fontSize: 24 }} />}
          />

          <MetricCard
            title="Most active event"
            value={getMetricValue('most_active_event_type', 'value') || 'N/A'}
            gradient="linear-gradient(135deg, #DC2626, #B91C1C)"
            icon={<Assessment sx={{ fontSize: 24 }} />}
          />

          <MetricCard
            title="Daily activity"
            value={formatNumber(getMetricValue('daily_activity_trend', 'points')?.[getMetricValue('daily_activity_trend', 'points')?.length - 1]?.events)}
            gradient="linear-gradient(135deg, #7C3AED, #6D28D9)"
            icon={<Timeline sx={{ fontSize: 24 }} />}
          />
        </Box>

        {/* Additional Charts Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <ChartCard
            title="User journey funnel"
            data={getMetricValue('user_journey_funnel', 'points') || []}
            type="multiLine"
            xDataKey="time"
            lines={[
              { dataKey: 'page_views', stroke: '#6366F1', name: 'Page Views' },
              { dataKey: 'cart_additions', stroke: '#22C55E', name: 'Cart Additions' },
              { dataKey: 'searches', stroke: '#F59E0B', name: 'Searches' }
            ]}
          />

          <ChartCard
            title="Activity by hour"
            data={getMetricValue('activity_by_hour', 'rows') || []}
            type="line"
            xDataKey="hour"
            yDataKey="events"
          />
        </Box>

        {/* Additional Tables Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <DataTable
            title="Most clicked elements"
            data={getMetricValue('most_clicked_elements', 'rows') || []}
            columns={[
              { field: 'element_name', headerName: 'Element', flex: 1, minWidth: 120 },
              { field: 'clicks', headerName: 'Clicks', flex: 0.5, minWidth: 80, type: 'number', align: 'right', headerAlign: 'right' }
            ]}
          />

          <DataTable
            title="Filter usage"
            data={getMetricValue('filter_usage', 'rows') || []}
            columns={[
              { field: 'filter_name', headerName: 'Filter', flex: 1, minWidth: 120 },
              { field: 'usage_count', headerName: 'Usage', flex: 0.5, minWidth: 80, type: 'number', align: 'right', headerAlign: 'right' }
            ]}
          />
        </Box>

        {/* Top Products Chart */}
        <Box sx={{ mb: 4 }}>
          <ChartCard
            title="Top performing products"
            data={getMetricValue('top_performing_products', 'rows') || []}
            type="bar"
            xDataKey="product_id"
            yDataKey="cart_additions"
          />
        </Box>
      </Container>
      
      <ProfileModal 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        profile={profile} 
      />
    </Box>
  );
};

export default ComprehensiveDashboard;