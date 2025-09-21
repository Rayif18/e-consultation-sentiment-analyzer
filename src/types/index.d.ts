// Type definitions for the E-Consultation Sentiment Analyzer

export interface AnalysisData {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  totalRecords: number;
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
  keyInsights: {
    topKeywords: string[];
    sentimentTrends: {
      date: string;
      positive: number;
      negative: number;
      neutral: number;
    }[];
    categoryDistribution: {
      category: string;
      count: number;
      percentage: number;
    }[];
  };
  recommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
  };
}

export interface UserRole {
  type: 'analyst' | 'policymaker';
  permissions: {
    canViewReports: boolean;
    canExportData: boolean;
    canManageUsers: boolean;
    canAccessAdvancedAnalytics: boolean;
  };
}

export interface ComponentProps {
  data?: AnalysisData;
  userRole?: UserRole['type'];
  onAnalysisComplete?: (data: AnalysisData) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface ThemeConfig {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
