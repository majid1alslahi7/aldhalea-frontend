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
  color?: string | null;
  news_count?: number;
}

export interface Writer {
  id: number;
  name: string;
  avatar?: string | null;
  bio?: string | null;
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
  stats?: ContentStats;
  reading_time?: { formatted?: string | null } | null;
  published_date?: string | null;
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
  stats?: ContentStats;
  published_diff?: string | null;
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
  total_votes: number;
  options: PollOption[];
}

export interface SearchResult {
  type: 'news' | 'article';
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
