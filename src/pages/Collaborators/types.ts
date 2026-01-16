// ==================== TYPES ====================

export type Tab = 'announcements' | 'enrollments' | 'analytics' | 'leaderboard';
export type EnrollmentStatus = 'enrolled' | 'uploaded' | 'processing' | 'under-review' | 'approved' | 'rejected';
export type DateRange = '7d' | '30d' | 'all';
export type Tier = 'rookie' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Campaign {
  id: string;
  merchant: string;
  logo: string;
  vertical: string;
  category: string;
  discount: string;
  reward: string;
  rewardExample: string;
  minOrder: string;
  videoReq: string;
  requirements: string[];
  budget: string;
  timeline: string;
  reviewNotes: string;
  productImage?: string;
  productName?: string;
}

export interface Enrollment {
  id: string;
  campaign: Campaign;
  status: EnrollmentStatus;
  referralUrl?: string;
  uploadedFile?: { name: string; size: number };
  rejectionReason?: string;
  stats?: { clicks: number; orders: number; earnings: number };
  clicks: number;
  orders: number;
  earnings: number;
  enrolledAt: Date;
}

export interface AnalyticsData {
  totalClicks: number;
  totalOrders: number;
  conversionRate: number;
  pendingEarnings: number;
  availableEarnings: number;
  dailyData: DailyDataPoint[];
  recentConversions: ConversionRecord[];
}

export interface DailyDataPoint {
  date: string;
  clicks: number;
  orders: number;
}

export interface ConversionRecord {
  merchant: string;
  amount: number;
  date: string;
  orderId: string;
  timestamp: Date; // Actual date for filtering
  status: 'Paid' | 'Open' | 'Pending';
  clicks: number; // Clicks associated with this conversion
}

export interface CollaboratorProfile {
  id: string;
  handle: string;
  avatar: string;
  tier: Tier;
  approvedCount: number;
  totalEarnings: number;
  followers?: number;
  conversionRate?: number;
  topCampaigns: { merchant: string; logo: string; earnings: number }[];
  joinedDate: string;
}

export interface MerchantLeaderboardEntry {
  merchantId: string;
  id: string;
  merchant: string;
  name: string;
  logo: string;
  commissionsGiven: number;
  collabsEnrolled: number;
  tags: string[];
}

export interface DailyWinner {
  collaboratorId: string;
  handle: string;
  collaborator: CollaboratorProfile;
  campaign: string;
  merchant: string;
  earnings: number;
}

export interface TierConfig {
  label: string;
  threshold: number;
  color: string;
  bgColor: string;
  icon: string;
  gradient: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  bg: string;
  text: string;
}

export interface TierProgress {
  current: number;
  target: number;
  percentage: number;
}
