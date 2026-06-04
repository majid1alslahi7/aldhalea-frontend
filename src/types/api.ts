export type LocalizedText = string | Record<string, string | null | undefined> | null | undefined;

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string | null;
  data: T;
  pagination?: Pagination;
  errors?: Record<string, string[]>;
}

export interface Category {
  id: number;
  name: LocalizedText;
  slug: LocalizedText;
  description?: LocalizedText;
  color?: string | null;
  news_count?: number;
}

export interface Writer {
  id: number;
  name: string;
  username?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role?: string | null;
  location?: string | null;
  website?: string | null;
  total_articles?: number;
  total_views?: number;
  social_links?: Record<string, string | null | undefined> | null;
}

export interface ContentStats {
  views?: number;
  unique_views?: number;
  shares?: number;
  comments?: number;
  likes?: number;
  bookmarks?: number;
}

export interface NewsItem {
  id: number;
  title: LocalizedText;
  slug: LocalizedText;
  subtitle?: LocalizedText;
  content?: LocalizedText;
  excerpt?: LocalizedText;
  main_image?: string | null;
  thumbnail?: string | null;
  category?: Category | null;
  writer?: Writer | null;
  tags?: TagItem[];
  source?: { name?: string | null; url?: string | null } | null;
  stats?: ContentStats;
  reading_time?: { formatted?: string | null } | null;
  published_date?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  published_diff?: string | null;
}

export interface ArticleItem {
  id: number;
  title: LocalizedText;
  slug: LocalizedText;
  content?: LocalizedText;
  excerpt?: LocalizedText;
  featured_image?: string | null;
  category?: Category | null;
  writer?: Writer | null;
  tags?: TagItem[];
  stats?: ContentStats;
  published_diff?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
}

export interface EditorialContentItem {
  id: number;
  title: LocalizedText;
  slug: LocalizedText;
  subtitle?: LocalizedText;
  content?: LocalizedText;
  excerpt?: LocalizedText;
  main_image?: string | null;
  thumbnail?: string | null;
  featured_image?: string | null;
  featured_video?: string | null;
  category?: Category | null;
  user?: Writer | null;
  writer?: Writer | null;
  interviewer?: Writer | null;
  interviewee_name?: string | null;
  interviewee_title?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  location?: string | null;
  views_count?: number;
  shares_count?: number;
  comments_count?: number;
  reading_time?: number | string | null;
  published_at?: string | null;
  updated_at?: string | null;
}

export interface PollOption {
  id: number;
  text: LocalizedText;
  color?: string | null;
  image?: string | null;
  votes_count: number;
  percentage: number;
}

export interface Poll {
  id: number;
  question: LocalizedText;
  description?: LocalizedText;
  status?: string;
  is_active?: boolean;
  total_votes: number;
  allow_multiple?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  options: PollOption[];
}

export interface TagItem {
  id: number;
  name: LocalizedText;
  slug: LocalizedText;
  description?: LocalizedText;
  color?: string | null;
  news_count?: number;
  is_trending?: boolean;
}

export interface CommentItem {
  id: number;
  content: string;
  user?: {
    id?: number | null;
    name?: string | null;
    avatar?: string | null;
  } | null;
  parent_id?: number | null;
  replies?: CommentItem[];
  replies_count?: number;
  likes_count?: number;
  is_pinned?: boolean;
  is_edited?: boolean;
  status?: string;
  time_ago?: string | null;
  created_at?: string | null;
}

export interface SearchResult {
  type: 'news' | 'article' | 'report' | 'investigation' | 'interview';
  data: NewsItem | ArticleItem;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
}

export interface NewsletterPayload {
  email: string;
  name?: string;
}

export interface SharePayload {
  shareable_type: string;
  shareable_id: number;
  platform: 'facebook' | 'twitter' | 'x' | 'whatsapp' | 'telegram' | 'email' | 'copy_link' | 'native' | 'other';
  url?: string;
}

export interface CorrectionReportPayload {
  content_type: string;
  content_id?: number;
  content_title?: string;
  url: string;
  reason: 'correction' | 'source' | 'image' | 'typo' | 'rights' | 'other' | string;
  details: string;
  evidence_url?: string;
  reporter_name?: string;
  reporter_email?: string;
  website?: string;
}
