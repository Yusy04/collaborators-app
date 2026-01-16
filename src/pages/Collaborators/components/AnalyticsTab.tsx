import { useState, useMemo, useEffect } from 'react';
import type { Enrollment, AnalyticsData, ConversionRecord, DailyDataPoint } from '../types';
import { statusConfig } from '../constants';
import { AreaChart } from './AreaChart';
import { PieChart } from './PieChart';
import { MiniChart } from './MiniChart';

interface AnalyticsTabProps {
  enrollments: Enrollment[];
}

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Check if a date falls within the time range
const isDateInRange = (date: Date, timeRange: TimeRange): boolean => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (timeRange) {
    case 'daily':
      // Last 7 days for daily view
      const weekAgoDaily = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgoDaily;
    case 'weekly':
      // Last 28 days for 4-week view
      const monthAgoWeekly = new Date(startOfToday.getTime() - 28 * 24 * 60 * 60 * 1000);
      return date >= monthAgoWeekly;
    case 'monthly':
      // Last 6 months
      const sixMonthsAgo = new Date(startOfToday.getTime() - 180 * 24 * 60 * 60 * 1000);
      return date >= sixMonthsAgo;
    case 'yearly':
      // Last 5 years (all historical data)
      const fiveYearsAgo = new Date(startOfToday.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
      return date >= fiveYearsAgo;
    default:
      return true;
  }
};

// Generate a pool of mock conversions with actual timestamps spanning the past year
const generateConversionPool = (enrollments: Enrollment[]): ConversionRecord[] => {
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
  if (approvedEnrollments.length === 0) return [];
  
  const conversions: ConversionRecord[] = [];
  const now = new Date();
  const statuses: ('Paid' | 'Open' | 'Pending')[] = ['Paid', 'Open', 'Pending'];
  
  // Generate conversions spread across the past year based on enrollment data
  approvedEnrollments.forEach(enrollment => {
    const orderCount = enrollment.orders || 0;
    const earningsPerOrder = orderCount > 0 ? (enrollment.earnings || 0) / orderCount : 0;
    const clicksPerOrder = orderCount > 0 ? Math.ceil((enrollment.clicks || 0) / orderCount) : 5;
    
    for (let i = 0; i < orderCount; i++) {
      // Distribute orders more evenly across all time periods
      // Use a mix of distributions to ensure good coverage for all chart views:
      // - Some orders in recent days (for daily view)
      // - Some orders spread across weeks (for weekly view)  
      // - Some orders spread across months (for monthly view)
      // - Some orders spread across years (for yearly view)
      
      let daysAgo: number;
      const distribution = Math.random();
      
      if (distribution < 0.15) {
        // 15% in last 7 days (good for daily view)
        daysAgo = Math.floor(Math.random() * 7);
      } else if (distribution < 0.35) {
        // 20% in last 8-30 days (good for weekly view)
        daysAgo = 7 + Math.floor(Math.random() * 23);
      } else if (distribution < 0.65) {
        // 30% in last 31-180 days (good for monthly view)
        daysAgo = 30 + Math.floor(Math.random() * 150);
      } else {
        // 35% spread across full year+ (good for yearly view)
        daysAgo = 180 + Math.floor(Math.random() * 900); // Up to ~3 years back
      }
      
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      // Format display date
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
      
      let displayDate: string;
      if (timestamp >= startOfToday) {
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        displayDate = `Today, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      } else if (timestamp >= startOfYesterday) {
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        displayDate = `Yesterday, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      } else {
        const month = timestamp.toLocaleDateString('en-US', { month: 'short' });
        const day = timestamp.getDate();
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        displayDate = `${month} ${day}, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
      
      conversions.push({
        merchant: enrollment.campaign.merchant,
        amount: parseFloat((earningsPerOrder * (0.8 + Math.random() * 0.4)).toFixed(2)),
        date: displayDate,
        orderId: `ORD-${8821 - conversions.length}`,
        timestamp,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        clicks: clicksPerOrder + Math.floor(Math.random() * 3),
      });
    }
  });
  
  // Sort by timestamp descending (most recent first)
  return conversions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate analytics data by filtering conversions based on time range
const generateAnalyticsData = (
  allConversions: ConversionRecord[],
  selectedMerchant: string,
  timeRange: TimeRange
): AnalyticsData => {
  // Filter by merchant if selected
  let filteredConversions = selectedMerchant === 'all'
    ? allConversions
    : allConversions.filter(c => c.merchant === selectedMerchant);
  
  // Filter by time range
  filteredConversions = filteredConversions.filter(c => isDateInRange(c.timestamp, timeRange));
  
  // Calculate totals from filtered conversions
  const totalClicks = filteredConversions.reduce((sum, c) => sum + c.clicks, 0);
  const totalOrders = filteredConversions.length;
  const pendingEarnings = filteredConversions.filter(c => c.status !== 'Paid').reduce((sum, c) => sum + c.amount, 0);
  const availableEarnings = filteredConversions.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.amount, 0);
  
  // Generate chart data points based on time range
  const dailyData: DailyDataPoint[] = [];
  const now = new Date();
  
  let dataPoints: number;
  let dateFormatter: (date: Date, index: number, total: number) => string;
  let getDateBucket: (date: Date) => string;
  
  switch (timeRange) {
    case 'daily':
      dataPoints = 7;
      dateFormatter = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
      getDateBucket = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
      break;
    case 'weekly':
      dataPoints = 4;
      dateFormatter = (_, i, total) => `Week ${total - i}`;
      getDateBucket = (date) => {
        const weekNum = Math.floor((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
        return `Week ${4 - Math.min(weekNum, 3)}`;
      };
      break;
    case 'monthly':
      dataPoints = 6;
      dateFormatter = (date) => date.toLocaleDateString('en-US', { month: 'short' });
      getDateBucket = (date) => date.toLocaleDateString('en-US', { month: 'short' });
      break;
    case 'yearly':
      dataPoints = 5;
      dateFormatter = (date) => date.getFullYear().toString();
      getDateBucket = (date) => date.getFullYear().toString();
      break;
  }
  
  // Create date buckets
  const buckets = new Map<string, { clicks: number; orders: number }>();
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now);
    switch (timeRange) {
      case 'daily':
        date.setDate(date.getDate() - i);
        break;
      case 'weekly':
        date.setDate(date.getDate() - (i * 7));
        break;
      case 'monthly':
        date.setMonth(date.getMonth() - i);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() - i);
        break;
    }
    const label = dateFormatter(date, i, dataPoints);
    buckets.set(label, { clicks: 0, orders: 0 });
  }
  
  // Aggregate conversions into buckets
  filteredConversions.forEach(conv => {
    const bucket = getDateBucket(conv.timestamp);
    if (buckets.has(bucket)) {
      const data = buckets.get(bucket)!;
      data.clicks += conv.clicks;
      data.orders += 1;
    }
  });
  
  // Convert buckets to array
  buckets.forEach((data, date) => {
    dailyData.push({
      date,
      clicks: data.clicks,
      orders: data.orders,
    });
  });
  
  return {
    totalClicks,
    totalOrders,
    conversionRate: totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0,
    pendingEarnings,
    availableEarnings,
    dailyData,
    recentConversions: filteredConversions, // Return all for pagination
  };
};

const ITEMS_PER_PAGE = 10;

export const AnalyticsTab = ({ enrollments }: AnalyticsTabProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get unique merchants from enrollments
  const merchants = useMemo(() => {
    const uniqueMerchants = [...new Set(enrollments.map(e => e.campaign.merchant))];
    return uniqueMerchants;
  }, [enrollments]);

  // Generate full conversion pool once (based on enrollment data)
  const allConversions = useMemo(() => {
    return generateConversionPool(enrollments);
  }, [enrollments]);

  // Generate analytics data by filtering conversions based on selected time range and merchant
  const analyticsData = useMemo<AnalyticsData>(() => {
    if (allConversions.length === 0) {
      return {
        totalClicks: 0,
        totalOrders: 0,
        conversionRate: 0,
        pendingEarnings: 0,
        availableEarnings: 0,
        dailyData: [],
        recentConversions: [],
      };
    }
    return generateAnalyticsData(allConversions, selectedMerchant, timeRange);
  }, [allConversions, selectedMerchant, timeRange]);

  // Generate merchant traffic data for pie chart
  const merchantTraffic = useMemo(() => {
    const colors = ['#E31837', '#6B2D5B', '#00C853', '#FFB800', '#3B82F6'];
    const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
    
    if (approvedEnrollments.length === 0) {
      return [
        { label: 'Restaurants', value: 55, color: '#E31837' },
        { label: 'Grocery', value: 25, color: '#6B2D5B' },
        { label: 'Market', value: 20, color: '#00C853' },
      ];
    }
    
    return approvedEnrollments.slice(0, 5).map((e, i) => ({
      label: e.campaign.merchant,
      value: e.clicks || Math.floor(Math.random() * 100) + 20,
      color: colors[i % colors.length],
    }));
  }, [enrollments]);

  // Video status updates (enrollment timeline)
  const videoStatusUpdates = useMemo(() => {
    return enrollments.slice(0, 5).map(e => ({
      id: e.id,
      merchant: e.campaign.merchant,
      logo: e.campaign.logo,
      status: e.status,
      statusLabel: statusConfig[e.status].label,
      time: getRelativeTime(e.enrolledAt),
    }));
  }, [enrollments]);

  // Mini chart data - uses the already time-filtered dailyData
  const miniChartData = useMemo(() => {
    const base = analyticsData.dailyData.length ? analyticsData.dailyData.slice(-7) : [];
    return {
      clicks: base.map(d => d.clicks),
      orders: base.map(d => d.orders),
      revenue: base.map(d => d.clicks * 0.5 + d.orders * 5),
      conversion: base.map(d => d.clicks > 0 ? (d.orders / d.clicks) * 100 : 0),
    };
  }, [analyticsData.dailyData]);

  // Filter conversions by search query
  const filteredConversions = useMemo(() => {
    if (!searchQuery.trim()) return analyticsData.recentConversions;
    const query = searchQuery.toLowerCase();
    return analyticsData.recentConversions.filter(conv => 
      conv.merchant.toLowerCase().includes(query) ||
      conv.orderId.toLowerCase().includes(query) ||
      conv.date.toLowerCase().includes(query) ||
      conv.amount.toString().includes(query)
    );
  }, [analyticsData.recentConversions, searchQuery]);

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMerchant, timeRange]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredConversions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedConversions = filteredConversions.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  // Check if there are approved enrollments
  const hasApprovedEnrollments = enrollments.some(e => e.status === 'approved');

  // Empty state - no enrollments at all
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Start by enrolling in campaigns from the Announcements tab. Once approved, your performance data will appear here.
        </p>
      </div>
    );
  }

  // Empty state - enrollments exist but none are approved yet
  if (!hasApprovedEnrollments) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pending Approval</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-4">
          You have {enrollments.length} enrollment{enrollments.length > 1 ? 's' : ''} in progress. Upload your video and wait for approval to see analytics data.
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {enrollments.slice(0, 3).map((e) => (
            <span key={e.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
              <span className="font-medium text-gray-700">{e.campaign.merchant}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                e.status === 'enrolled' ? 'bg-amber-100 text-amber-700' :
                e.status === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                e.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                e.status === 'under-review' ? 'bg-indigo-100 text-indigo-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {e.status.replace('-', ' ')}
              </span>
            </span>
          ))}
          {enrollments.length > 3 && (
            <span className="text-sm text-gray-400">+{enrollments.length - 3} more</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Dashboard Overview + Traffic */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Dashboard Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Header with Time Range Tabs + Merchant Filter */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Dashboard</h2>
                <p className="text-xs text-gray-400">Overview of Latest Month</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  {(['daily', 'weekly', 'monthly', 'yearly'] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        timeRange === range
                          ? 'bg-white text-snoonu-red shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
                {/* Chart Legend */}
                <div className="hidden sm:flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-snoonu-red"></span>
                    Clicks
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Orders
                  </span>
                </div>
              </div>
            </div>
            
            {/* Merchant Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Filter by Merchant:</label>
              <select
                value={selectedMerchant}
                onChange={(e) => setSelectedMerchant(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-snoonu-red/20 focus:border-snoonu-red bg-white"
              >
                <option value="all">All Merchants</option>
                {merchants.map(merchant => (
                  <option key={merchant} value={merchant}>{merchant}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Stats + Chart */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Big Numbers */}
            <div className="md:w-1/3 space-y-4">
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {analyticsData.availableEarnings.toFixed(2)} <span className="text-lg font-normal text-gray-500">QAR</span>
                </div>
                <p className="text-sm text-gray-500">
                  {timeRange === 'daily' ? 'Daily' : timeRange === 'weekly' ? 'Weekly' : timeRange === 'monthly' ? 'Monthly' : 'Yearly'} Earnings
                </p>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-gray-800">{analyticsData.totalOrders}</div>
                <p className="text-sm text-gray-500">
                  {timeRange === 'daily' ? 'Daily' : timeRange === 'weekly' ? 'Weekly' : timeRange === 'monthly' ? 'Monthly' : 'Yearly'} Sales
                </p>
              </div>

              <button className="px-4 py-2 bg-gradient-to-r from-snoonu-red to-red-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {timeRange === 'daily' ? 'Yesterday' : timeRange === 'weekly' ? 'Last Week' : timeRange === 'monthly' ? 'Last Month' : 'Last Year'} Summary
              </button>
            </div>

            {/* Right: Chart */}
            <div className="md:w-2/3">
              {analyticsData.dailyData.length > 0 ? (
                <AreaChart
                  data={analyticsData.dailyData}
                  dataKey="clicks"
                  color="#E31837"
                  gradientId="mainChartGradient"
                  height={200}
                  showSecondary={true}
                />
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-400">
                  <p>No chart data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="font-semibold text-gray-900">{analyticsData.availableEarnings.toFixed(2)} QAR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Referral Earning</p>
                <p className="font-semibold text-gray-900">{(analyticsData.availableEarnings * 0.3).toFixed(2)} QAR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Orders</p>
                <p className="font-semibold text-gray-900">{analyticsData.totalOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Clicks</p>
                <p className="font-semibold text-gray-900">{analyticsData.totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic by Merchants */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Traffic</h3>
          <p className="text-xs text-gray-400 mb-6">By Merchant Category</p>
          
          <PieChart data={merchantTraffic} size={140} />
        </div>
      </div>

      {/* Colored Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Status */}
        <div className="bg-gradient-to-br from-snoonu-red to-red-600 rounded-2xl p-5 text-white relative overflow-hidden min-h-[140px]">
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
            <MiniChart data={miniChartData.revenue.length ? miniChartData.revenue : [3, 5, 4, 6, 5, 7, 6]} type="bar" color="white" />
          </div>
          <p className="text-xs font-medium opacity-80 mb-1">Revenue Status</p>
          <p className="text-2xl font-bold">{analyticsData.availableEarnings.toFixed(0)} QAR</p>
          <p className="text-xs opacity-70 mt-auto absolute bottom-5 left-5">Jan 01 - Jan {new Date().getDate()}</p>
        </div>

        {/* Page Views (Clicks) */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 text-white relative overflow-hidden min-h-[140px]">
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
            <MiniChart data={miniChartData.clicks.length ? miniChartData.clicks : [10, 15, 12, 18, 14, 20, 16]} type="area" color="white" />
          </div>
          <p className="text-xs font-medium opacity-80 mb-1">Page Views</p>
          <p className="text-2xl font-bold">{analyticsData.totalClicks.toLocaleString()}</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white relative overflow-hidden min-h-[140px]">
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
            <MiniChart data={miniChartData.conversion.length ? miniChartData.conversion : [5, 8, 6, 9, 7, 10, 8]} type="line" color="white" />
          </div>
          <p className="text-xs font-medium opacity-80 mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold">{analyticsData.conversionRate.toFixed(1)}%</p>
          <p className="text-xs opacity-70 mt-auto absolute bottom-5 left-5">Jan 01 - Jan {new Date().getDate()}</p>
        </div>

        {/* Orders */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-5 text-white relative overflow-hidden min-h-[140px]">
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
            <MiniChart data={miniChartData.orders.length ? miniChartData.orders : [2, 4, 3, 5, 4, 6, 5]} type="bar" color="white" />
          </div>
          <p className="text-xs font-medium opacity-80 mb-1">Total Orders</p>
          <p className="text-2xl font-bold">{analyticsData.totalOrders}</p>
          <p className="text-xs opacity-70 mt-auto absolute bottom-5 left-5">Jan 01 - Jan {new Date().getDate()}</p>
        </div>
      </div>

      {/* Bottom Section: Video Status Updates + Recent Conversions */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Video Status Updates (Timeline) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Video Status Updates</h3>
          
          {videoStatusUpdates.length > 0 ? (
            <div className="space-y-3">
              {videoStatusUpdates.map((update, i) => (
                <div key={update.id} className="flex items-start gap-3">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getStatusBgColor(update.status)}`}>
                      <StatusIcon status={update.status} />
                    </div>
                    {i < videoStatusUpdates.length - 1 && (
                      <div className="w-0.5 h-6 bg-gray-200 mt-1.5" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900 text-sm truncate">{update.statusLabel}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{update.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{update.merchant}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No video updates yet</p>
          )}
        </div>

        {/* Recent Conversions Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Recent Conversions</h3>
              <p className="text-xs text-gray-400">Overview of Latest Orders</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-snoonu-red/20 focus:border-snoonu-red w-48"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedConversions.length > 0 ? (
                  paginatedConversions.map((conv: ConversionRecord) => (
                    <tr key={conv.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{conv.orderId}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{conv.merchant}</td>
                      <td className="px-4 py-3 text-gray-500">{conv.date}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{conv.amount.toFixed(2)} QAR</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                          conv.status === 'Paid'
                            ? 'bg-green-100 text-green-700' 
                            : conv.status === 'Open' 
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {conv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      {searchQuery ? 'No matching conversions found' : 'No conversions yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredConversions.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredConversions.length)} of {filteredConversions.length} entries</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  &lt;
                </button>
                {getPageNumbers().map((page, idx) => (
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 rounded-full min-w-[28px] ${currentPage === page ? 'bg-snoonu-red text-white' : 'hover:bg-gray-100'}`}
                      style={currentPage === page ? { backgroundColor: '#E31837' } : {}}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="px-1">...</span>
                  )
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-2 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} Mins Ago`;
  if (hours < 24) return `${hours} Hours Ago`;
  if (days === 1) return '1 Day Ago';
  return `${days} Days Ago`;
}

function getStatusBgColor(status: string): string {
  switch (status) {
    case 'enrolled': return 'bg-amber-100';
    case 'uploaded': return 'bg-blue-100';
    case 'processing': return 'bg-purple-100';
    case 'under-review': return 'bg-orange-100';
    case 'approved': return 'bg-green-100';
    case 'rejected': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
}

function StatusIcon({ status }: { status: string }) {
  const iconClass = "w-4 h-4";
  switch (status) {
    case 'enrolled':
      return <svg className={`${iconClass} text-amber-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
    case 'uploaded':
      return <svg className={`${iconClass} text-blue-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
    case 'processing':
      return <svg className={`${iconClass} text-purple-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
    case 'under-review':
      return <svg className={`${iconClass} text-orange-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
    case 'approved':
      return <svg className={`${iconClass} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'rejected':
      return <svg className={`${iconClass} text-red-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default:
      return <svg className={`${iconClass} text-gray-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
}
