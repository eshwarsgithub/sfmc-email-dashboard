// src/services/sfmcService.ts
import axios from 'axios';

export interface DashboardData {
  overview: {
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  trends: Array<{
    date: string;
    opens: number;
    clicks: number;
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    date: string;
    status: string;
    sent: number;
    opened: number;
    clicked: number;
  }>;
  isRealData: boolean;
  error?: string;
  connectionStatus?: string;
  sfmcConnected?: boolean;
}

class SFMCService {
  private clientId: string;
  private clientSecret: string;
  private subdomain: string;

  constructor() {
    this.clientId = import.meta.env.VITE_SFMC_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_SFMC_CLIENT_SECRET || '';
    this.subdomain = import.meta.env.VITE_SFMC_SUBDOMAIN || '';
  }

  async getDashboardData(daysPeriod: number = 30): Promise<DashboardData> {
    try {
      // Use backend API - works both locally and on Vercel
      const apiUrl = import.meta.env.PROD 
        ? '/api/dashboard' 
        : 'http://localhost:3001/api/dashboard';
        
      const response = await axios.get(apiUrl, {
        params: { period: daysPeriod },
        timeout: 30000
      });
      
      console.log('✅ Successfully fetched data from backend');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch data from backend, falling back to demo data:', error);
      return this.getDemoData(daysPeriod, `Backend API error: ${(error as Error).message}`);
    }
  }

  private getDemoData(daysPeriod: number, error?: string): DashboardData {
    // Generate demo data based on the period
    const baseMultiplier = daysPeriod / 30;
    
    // Generate trend data
    const trends = [];
    for (let i = daysPeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        opens: Math.floor(Math.random() * 1000 + 500) * baseMultiplier,
        clicks: Math.floor(Math.random() * 200 + 100) * baseMultiplier
      });
    }

    // Generate demo campaigns
    const campaigns = [
      {
        id: '1',
        name: 'Summer Sale Newsletter',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
        sent: Math.floor(15000 * baseMultiplier),
        opened: Math.floor(4500 * baseMultiplier),
        clicked: Math.floor(675 * baseMultiplier)
      },
      {
        id: '2',
        name: 'Product Launch Announcement',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
        sent: Math.floor(8200 * baseMultiplier),
        opened: Math.floor(2460 * baseMultiplier),
        clicked: Math.floor(410 * baseMultiplier)
      },
      {
        id: '3',
        name: 'Weekly Newsletter #23',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        sent: Math.floor(12000 * baseMultiplier),
        opened: Math.floor(3600 * baseMultiplier),
        clicked: Math.floor(540 * baseMultiplier)
      },
      {
        id: '4',
        name: 'Customer Survey',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
        sent: Math.floor(5500 * baseMultiplier),
        opened: Math.floor(1375 * baseMultiplier),
        clicked: Math.floor(275 * baseMultiplier)
      },
      {
        id: '5',
        name: 'Holiday Promotion',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Scheduled',
        sent: Math.floor(20000 * baseMultiplier),
        opened: 0,
        clicked: 0
      }
    ];

    // Calculate totals
    const totalSent = Math.floor(50000 * baseMultiplier);
    const delivered = Math.floor(48500 * baseMultiplier);
    const opened = Math.floor(14550 * baseMultiplier);
    const clicked = Math.floor(2180 * baseMultiplier);
    const bounced = Math.floor(1500 * baseMultiplier);

    return {
      overview: {
        totalSent,
        delivered,
        opened,
        clicked,
        bounced
      },
      trends,
      campaigns,
      isRealData: false,
      error
    };
  }

  // Removed unused methods to fix TypeScript compilation

  async testConnection(): Promise<boolean> {
    // Simplified test - just check if credentials are present
    return !!(this.clientId && this.clientSecret && this.subdomain);
  }
}

const sfmcService = new SFMCService();
export default sfmcService;