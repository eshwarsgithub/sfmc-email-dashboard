// src/App.tsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Mail, 
  TrendingUp, 
  MousePointer, 
  AlertCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Activity,
  Calendar,
  Upload,
  Download
} from 'lucide-react';
import sfmcService from './services/sfmcService';
import type { DashboardData } from './services/sfmcService';
import DataUpload from './components/DataUpload';
import './App.css';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`trend ${trend > 0 ? 'trend-positive' : 'trend-negative'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="stat-card-content">
        <h3 className="stat-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

interface CampaignRowProps {
  campaign: DashboardData['campaigns'][0];
}

const CampaignRow: React.FC<CampaignRowProps> = ({ campaign }) => {
  const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : '0.0';
  const clickRate = campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : '0.0';
  
  const statusColors = {
    'Completed': 'status-completed',
    'Active': 'status-active',
    'Scheduled': 'status-scheduled'
  };

  return (
    <tr className="campaign-row">
      <td className="campaign-name">
        <div>
          <div className="campaign-title">{campaign.name}</div>
          <div className="campaign-date">{new Date(campaign.date).toLocaleDateString()}</div>
        </div>
      </td>
      <td className="campaign-status">
        <span className={`status ${statusColors[campaign.status as keyof typeof statusColors] || 'status-completed'}`}>
          {campaign.status}
        </span>
      </td>
      <td className="campaign-metric">{campaign.sent.toLocaleString()}</td>
      <td className="campaign-metric">{campaign.opened.toLocaleString()}</td>
      <td className="campaign-rate open-rate">{openRate}%</td>
      <td className="campaign-metric">{campaign.clicked.toLocaleString()}</td>
      <td className="campaign-rate click-rate">{clickRate}%</td>
    </tr>
  );
};

const App: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [dataSource, setDataSource] = useState<'api' | 'csv' | 'manual'>('api');

  // Add error logging
  useEffect(() => {
    console.log('App component mounted');
    console.log('Environment check:', {
      clientId: import.meta.env.VITE_SFMC_CLIENT_ID,
      subdomain: import.meta.env.VITE_SFMC_SUBDOMAIN,
      hasClientSecret: !!import.meta.env.VITE_SFMC_CLIENT_SECRET
    });
  }, []);

  // Load dashboard data
  const loadDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const period = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
      const dashboardData = await sfmcService.getDashboardData(period);
      
      setData(dashboardData);
      setLastUpdated(new Date());
      setIsConnected(dashboardData.sfmcConnected || dashboardData.isRealData);
      
      if (dashboardData.error && !dashboardData.sfmcConnected) {
        setError(dashboardData.error);
      } else if (dashboardData.connectionStatus) {
        setError(dashboardData.connectionStatus);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError((error as Error).message);
      setIsConnected(false);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // Initial load and auto-refresh setup
  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 15 minutes
    const interval = setInterval(() => loadDashboardData(false), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  // Manual refresh function
  const handleRefresh = () => {
    loadDashboardData();
  };

  // Handle uploaded data
  const handleDataUploaded = (uploadedData: Partial<DashboardData>) => {
    if (uploadedData.campaigns) {
      setDataSource(uploadedData.connectionStatus?.includes('CSV') ? 'csv' : 'manual');
    }
    
    const mergedData: DashboardData = {
      overview: uploadedData.overview || data?.overview || {
        totalSent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0
      },
      trends: uploadedData.trends || data?.trends || [],
      campaigns: uploadedData.campaigns || data?.campaigns || [],
      isRealData: true,
      connectionStatus: uploadedData.connectionStatus,
      sfmcConnected: uploadedData.sfmcConnected || false
    };

    setData(mergedData);
    setLastUpdated(new Date());
    setIsConnected(true);
    setShowUpload(false);
    setError(null);
  };

  // Export data as CSV
  const exportData = () => {
    if (!data) return;

    const csvContent = [
      ['Campaign Name', 'Date', 'Status', 'Sent', 'Delivered', 'Opened', 'Clicked', 'Bounced', 'Open Rate', 'Click Rate'].join(','),
      ...data.campaigns.map(campaign => [
        `"${campaign.name}"`,
        campaign.date,
        campaign.status,
        campaign.sent,
        campaign.sent, // delivered
        campaign.opened,
        campaign.clicked,
        0, // bounced (if not available)
        campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(2) : '0',
        campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(2) : '0'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_campaigns_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <RefreshCw className="loading-spinner" />
          <h3>Loading Dashboard</h3>
          <p>Connecting to Salesforce Marketing Cloud...</p>
        </div>
      </div>
    );
  }

  const calculateRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0.0';
  };

  const openRate = calculateRate(data.overview.opened, data.overview.delivered);
  const clickRate = calculateRate(data.overview.clicked, data.overview.delivered);
  const bounceRate = calculateRate(data.overview.bounced, data.overview.totalSent);

  const pieData = [
    { name: 'Opened', value: data.overview.opened, color: '#10b981' },
    { name: 'Clicked', value: data.overview.clicked, color: '#3b82f6' },
    { name: 'Bounced', value: data.overview.bounced, color: '#ef4444' },
    { name: 'Not Opened', value: data.overview.delivered - data.overview.opened, color: '#e5e7eb' }
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>{import.meta.env.VITE_DASHBOARD_TITLE || 'Email Campaign Dashboard'}</h1>
            <div className="header-subtitle">
              <p>Real-time insights from Salesforce Marketing Cloud</p>
              <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                {dataSource === 'api' && isConnected && 'SFMC Connected'}
                {dataSource === 'csv' && 'CSV Data'}
                {dataSource === 'manual' && 'Manual Data'}
                {!isConnected && 'Demo Mode'}
              </div>
            </div>
            {error && (
              <div className="error-banner">
                <AlertCircle size={16} />
                <span>⚠️ Using demo data: {error}</span>
              </div>
            )}
          </div>
          <div className="header-controls">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-selector"
              disabled={isLoading}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <button
              onClick={() => setShowUpload(true)}
              className="upload-button"
              title="Import your email campaign data"
            >
              <Upload size={16} />
              Import Data
            </button>
            <button
              onClick={exportData}
              disabled={!data?.campaigns?.length}
              className="export-button"
              title="Export current data as CSV"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="refresh-button"
            >
              <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
              {isLoading ? 'Refreshing' : 'Refresh'}
            </button>
            <div className="last-updated">
              <Activity size={16} />
              {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Key Metrics */}
        <section className="metrics-grid">
          <StatCard
            icon={Mail}
            title="Total Emails Sent"
            value={data.overview.totalSent}
            subtitle={`${data.overview.delivered.toLocaleString()} delivered`}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            title="Open Rate"
            value={`${openRate}%`}
            subtitle={`${data.overview.opened.toLocaleString()} opens`}
            trend={2.3}
            color="green"
          />
          <StatCard
            icon={MousePointer}
            title="Click Rate"
            value={`${clickRate}%`}
            subtitle={`${data.overview.clicked.toLocaleString()} clicks`}
            trend={-0.5}
            color="orange"
          />
          <StatCard
            icon={AlertCircle}
            title="Bounce Rate"
            value={`${bounceRate}%`}
            subtitle={`${data.overview.bounced.toLocaleString()} bounces`}
            trend={-1.2}
            color="red"
          />
        </section>

        {/* Charts Row */}
        <section className="charts-grid">
          {/* Trend Chart */}
          <div className="chart-container trends-chart">
            <h3>Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="opens" stroke="#10b981" strokeWidth={2} name="Opens" />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="chart-container engagement-chart">
            <h3>Engagement Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {pieData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campaign Table */}
        <section className="campaigns-section">
          <div className="section-header">
            <h3>Recent Campaigns</h3>
            <Calendar size={20} />
          </div>
          <div className="table-container">
            <table className="campaigns-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Opens</th>
                  <th>Open Rate</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign, index) => (
                  <CampaignRow key={campaign.id || index} campaign={campaign} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div>Powered by Salesforce Marketing Cloud</div>
          <div>Data refreshed every 15 minutes</div>
        </div>
      </footer>

      {/* Data Upload Modal */}
      {showUpload && (
        <DataUpload
          onDataUploaded={handleDataUploaded}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default App;