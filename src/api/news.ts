import apiClient from './client';
import type { ContactPayload, NewsletterPayload } from '@/types/api';

export const newsAPI = {
  getAll(filters?: Record<string, unknown>) { return apiClient.get('/news', { params: filters }); },
  getBreaking() { return apiClient.get('/news/breaking'); },
  getFeatured() { return apiClient.get('/news/featured'); },
  getTrending(days = 7) { return apiClient.get('/news/trending', { params: { days } }); },
  getEditorsPicks() { return apiClient.get('/news/editors-picks'); },
  getLocal() { return apiClient.get('/news/local'); },
  getPopular(period = 'week') { return apiClient.get('/news/popular', { params: { period } }); },
  getLatest(page = 1) { return apiClient.get('/news/latest', { params: { page } }); },
  getByDate(date: string, page = 1) { return apiClient.get(`/news/by-date/${date}`, { params: { page } }); },
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
  getAll(page = 1) { return apiClient.get('/polls', { params: { page } }); },
  getActive() { return apiClient.get('/polls/active'); },
  getFeatured() { return apiClient.get('/polls/featured'); },
  getById(id: string | number) { return apiClient.get(`/polls/${id}`); },
  getResults(id: string | number) { return apiClient.get(`/polls/${id}/results`); },
  vote(pollId: number, optionId: number) { return apiClient.post(`/polls/${pollId}/vote`, { option_id: optionId }); },
};

export const tagAPI = {
  getAll() { return apiClient.get('/tags'); },
  getTrending() { return apiClient.get('/tags/trending'); },
  getPopular() { return apiClient.get('/tags/popular'); },
  getBySlug(slug: string) { return apiClient.get(`/tags/${slug}`); },
  getNews(slug: string, page = 1) { return apiClient.get(`/tags/${slug}/news`, { params: { page } }); },
  getArticles(slug: string, page = 1) { return apiClient.get(`/tags/${slug}/articles`, { params: { page } }); },
};

export const writerAPI = {
  getAll() { return apiClient.get('/writers'); },
  getFeatured() { return apiClient.get('/writers/featured'); },
  getById(id: string | number) { return apiClient.get(`/writers/${id}`); },
  getArticles(id: string | number, page = 1) { return apiClient.get(`/writers/${id}/articles`, { params: { page } }); },
};

export const commentAPI = {
  getAll(type: string, id: number | string, page = 1) { return apiClient.get(`/comments/${type}/${id}`, { params: { page } }); },
};

export const searchAPI = {
  search(query: string, type = 'all') { return apiClient.get('/search', { params: { q: query.trim(), type } }); },
};

export const contactAPI = {
  send(payload: ContactPayload) { return apiClient.post('/contact', payload); },
};

export const newsletterAPI = {
  subscribe(payload: NewsletterPayload) { return apiClient.post('/newsletter/subscribe', payload); },
  unsubscribe(payload: NewsletterPayload) { return apiClient.post('/newsletter/unsubscribe', payload); },
};
