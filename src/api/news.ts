import apiClient from './client';

export const newsAPI = {
  getAll(filters?: any) { return apiClient.get('/news', { params: filters }); },
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
  getAll(filters?: any) { return apiClient.get('/articles', { params: filters }); },
  getFeatured() { return apiClient.get('/articles/featured'); },
  getPopular() { return apiClient.get('/articles/popular'); },
  getBySlug(slug: string) { return apiClient.get(`/articles/${slug}`); },
};

export const pollAPI = {
  getActive() { return apiClient.get('/polls/active'); },
  getFeatured() { return apiClient.get('/polls/featured'); },
};

export const searchAPI = {
  search(query: string, type = 'all') { return apiClient.get('/search', { params: { q: query, type } }); },
};
