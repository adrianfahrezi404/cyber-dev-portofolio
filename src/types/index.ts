// ===========================================
// CYBER.DEV Portfolio — Shared TypeScript Types
// ===========================================

// Experience types
export type ExperienceType = "WORK" | "COMPETITION" | "ACHIEVEMENT";

export interface Experience {
  id: number;
  title: string;
  companyOrEvent: string;
  description: string | null;
  type: ExperienceType;
  startDate: string;
  endDate: string | null;
  createdAt: Date;
}

// Certificate types
export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

// Technology types
export type TechCategory =
  | "RED_TEAM"
  | "WEB_DEV"
  | "AI_DATA"
  | "DEVOPS"
  | "LANGUAGE"
  | "OTHER";

export interface Technology {
  id: number;
  name: string;
  iconUrl: string | null;
  category: TechCategory;
}

// Content (Projects & Write-ups) types
export type ContentType = "PROJECT" | "WRITEUP";

export interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  thumbnailUrl: string | null;
  githubSyncUrl: string | null;
  featured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  technologies?: Technology[];
}

// Contact message types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Site stats
export interface SiteStats {
  id: number;
  pageViews: number;
  lastGithubSync: Date | null;
}

// Dashboard aggregated stats
export interface DashboardStats {
  totalPageViews: number;
  unreadMessages: number;
  totalProjects: number;
  totalWriteups: number;
  lastGithubSync: Date | null;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Form state for server actions
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
