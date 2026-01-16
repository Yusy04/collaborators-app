import type { Tier, Enrollment, AnalyticsData, TierProgress } from './types';
import { tierConfig, tierOrder } from './constants';

// ==================== TIER HELPERS ====================
export const computeTier = (approvedCount: number): Tier => {
  for (let i = tierOrder.length - 1; i >= 0; i--) {
    if (approvedCount >= tierConfig[tierOrder[i]].threshold) {
      return tierOrder[i];
    }
  }
  return 'rookie';
};

export const getNextTier = (currentTier: Tier): Tier | null => {
  const currentIndex = tierOrder.indexOf(currentTier);
  return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
};

export const getProgressToNextTier = (approvedCount: number): TierProgress => {
  const currentTier = computeTier(approvedCount);
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) {
    return { current: approvedCount, target: approvedCount, percentage: 100 };
  }
  
  const currentThreshold = tierConfig[currentTier].threshold;
  const nextThreshold = tierConfig[nextTier].threshold;
  const progress = approvedCount - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  
  return {
    current: progress,
    target: needed,
    percentage: Math.min((progress / needed) * 100, 100),
  };
};

// ==================== ANALYTICS HELPERS ====================
export const generateAnalyticsData = (enrollments: Enrollment[]): AnalyticsData => {
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
  const totalClicks = approvedEnrollments.reduce((sum, e) => sum + e.clicks, 0);
  const totalOrders = approvedEnrollments.reduce((sum, e) => sum + e.orders, 0);
  const totalEarnings = approvedEnrollments.reduce((sum, e) => sum + e.earnings, 0);
  
  // Generate daily data for charts
  const dailyData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: Math.floor(Math.random() * 20) + (i < 7 ? 10 : 5),
      orders: Math.floor(Math.random() * 5) + (i < 7 ? 2 : 1),
    });
  }

  return {
    totalClicks,
    totalOrders,
    conversionRate: totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0,
    pendingEarnings: totalEarnings * 0.3,
    availableEarnings: totalEarnings * 0.7,
    dailyData,
    recentConversions: [
      { merchant: 'Burger Majlis', amount: 4.50, date: 'Today, 2:30 PM', orderId: 'ORD-8821', timestamp: new Date(), status: 'Paid', clicks: 12 },
      { merchant: 'Cafe Arabica', amount: 4.00, date: 'Today, 11:15 AM', orderId: 'ORD-8819', timestamp: new Date(Date.now() - 3600000), status: 'Open', clicks: 8 },
      { merchant: 'Burger Majlis', amount: 4.50, date: 'Yesterday', orderId: 'ORD-8815', timestamp: new Date(Date.now() - 86400000), status: 'Paid', clicks: 15 },
      { merchant: 'Pizza Palace', amount: 7.20, date: 'Jan 14', orderId: 'ORD-8802', timestamp: new Date(Date.now() - 172800000), status: 'Pending', clicks: 22 },
      { merchant: 'FreshBox Market', amount: 3.00, date: 'Jan 13', orderId: 'ORD-8798', timestamp: new Date(Date.now() - 259200000), status: 'Paid', clicks: 6 },
    ]
  };
};

// ==================== ENROLLMENT HELPERS ====================
export const isTerminalState = (status: Enrollment['status']): boolean => {
  return status === 'approved' || status === 'rejected';
};

export const nextEnrollmentState = (status: Enrollment['status']): Enrollment['status'] | null => {
  const stateOrder: Enrollment['status'][] = ['enrolled', 'uploaded', 'processing', 'under-review', 'approved'];
  const currentIndex = stateOrder.indexOf(status);
  
  if (currentIndex === -1 || currentIndex === stateOrder.length - 1) {
    return null;
  }
  
  return stateOrder[currentIndex + 1];
};
