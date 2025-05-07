
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'user' | 'admin' | 'moderator';
  savedContent: string[];
  reportedContent: string[];
  createdAt: Date;
}

// Auth related types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Credit transaction types
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  timestamp: Date;
}

// Content related types
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  source: 'linkedin';
  sourceUrl: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  saves: number;
  shares: number;
  reports: number;
}

// Feed related types
export interface FeedState {
  items: ContentItem[];
  isLoading: boolean;
  error: string | null;
}

// Admin panel related types
export interface ReportedContent extends ContentItem {
  reportedBy: string[];
  reportReasons: string[];
  status: 'pending' | 'reviewed' | 'removed';
}

export interface AdminStats {
  totalUsers: number;
  totalContent: number;
  topSavedContent: ContentItem[];
  mostActiveUsers: User[];
  pendingReports: number;
}
