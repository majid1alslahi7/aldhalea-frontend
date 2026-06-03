import apiClient from './client';
import type { ContactPayload } from '@/types/api';

export const newsAPI = {
  getAll(filters?: Record<string, unknown>) { return apiClient.get('/news', { params: filters }); },
  getBreaking() { return apiClient.get('/news/breaking'); },
  getFeatured() { return apiClient.get('/news/featured'); },
  getTrending(days = 7) { return apiClient.get('/news/trending', { params: { days } }); },
  getEditorsPicks() { return apiClient.get('/news/editors-picks'); },
  getLocal() { return apiClient.get('/news/local'); },
  getPopular(period = 'week') { return apiClient.get('/news/popular', { params: { period } }); },
  getLatest(page = 1) { return apiClient.get('/news/latest', { params: { page } }); },
  getBySlug(slug: string) { return apiClient.get(`/news/${slug}`); },
};

export const categoryAPI = {
  getAll() { return apiClient.get('/categories'); },
  getMenu() { return apiClient.get('/categories/menu'); },
  getBySlug(slug: string) { return apiClient.get(`/categories/${slug}`); },
  getNews(slug: string, page = 1) { return apiClient.get(`/categories/${slug}/news`, { params: { page } }); },
};

export const articleAPI = {
  getAll(filters?: Record<string, unknown>) { return apiClient.get('/articles', { params: filters }); },
  getFeatured() { return apiClient.get('/articles/featured'); },
  getPopular() { return apiClient.get('/articles/popular'); },
  getLatest() { return apiClient.get('/articles/latest'); },
  getBySlug(slug: string) { return apiClient.get(`/articles/${slug}`); },
};

export const reportAPI = {
  getAll(filters?: Record<string, unknown>) { return apiClient.get('/reports', { params: filters }); },
  getLatest() { return apiClient.get('/reports/latest'); },
  getBySlug(slug: string) { return apiClient.get(`/reports/${slug}`); },
};

export const investigationAPI = {
  getAll(filters?: Record<string, unknown>) { return apiClient.get('/investigations', { params: filters }); },
  getLatest() { return apiClient.get('/investigations/latest'); },
  getBySlug(slug: string) { return apiClient.get(`/investigations/${slug}`); },
};

export const interviewAPI = {
  getAll(filters?: Record<string, unknown>) { return apiClient.get('/interviews', { params: filters }); },
  getLatest() { return apiClient.get('/interviews/latest'); },
  getBySlug(slug: string) { return apiClient.get(`/interviews/${slug}`); },
};

export const pollAPI = {
  getActive() { return apiClient.get('/polls/active'); },
  getFeatured() { return apiClient.get('/polls/featured'); },
  vote(pollId: number, optionId: number) { return apiClient.post(`/polls/${pollId}/vote`, { option_id: optionId }); },
};

export const searchAPI = {
  search(query: string, type = 'all') { return apiClient.get('/search', { params: { q: query.trim(), type } }); },
};

export const contactAPI = {
  send(payload: ContactPayload) { return apiClient.post('/contact', payload); },
};
