import { defineStore } from 'pinia';
import { ref } from 'vue';
import { newsAPI } from '@/api/news';
import type { ApiEnvelope, NewsItem } from '@/types/api';
import { apiArray, apiData } from '@/utils/content';

export const useNewsStore = defineStore('news', () => {
  const breakingNews = ref<NewsItem[]>([]);
  const featuredNews = ref<NewsItem[]>([]);
  const latestNews = ref<NewsItem[]>([]);
  const trendingNews = ref<NewsItem[]>([]);
  const editorsPicks = ref<NewsItem[]>([]);
  const localNews = ref<NewsItem[]>([]);
  const currentNews = ref<NewsItem | null>(null);
  const loading = ref(false);

  async function fetchBreakingNews() {
    try {
      const res = await newsAPI.getBreaking();
      breakingNews.value = apiArray<NewsItem>(res);
    } catch {
      breakingNews.value = [];
    }
  }

  async function fetchFeaturedNews() {
    try {
      const res = await newsAPI.getFeatured();
      featuredNews.value = apiArray<NewsItem>(res);
    } catch {
      featuredNews.value = [];
    }
  }
  async function fetchLatestNews(page = 1) {
    loading.value = true;
    try {
      const res = await newsAPI.getLatest(page);
      const items = apiArray<NewsItem>(res);
      latestNews.value = page === 1 ? items : [...latestNews.value, ...items];
      return (res as Partial<ApiEnvelope<NewsItem[]>>).pagination;
    } catch {
      if (page === 1) latestNews.value = [];
      return null;
    } finally {
      loading.value = false;
    }
  }
  async function fetchTrendingNews(days = 7) {
    try {
      const res = await newsAPI.getTrending(days);
      trendingNews.value = apiArray<NewsItem>(res);
    } catch {
      trendingNews.value = [];
    }
  }

  async function fetchEditorsPicks() {
    try {
      const res = await newsAPI.getEditorsPicks();
      editorsPicks.value = apiArray<NewsItem>(res);
    } catch {
      editorsPicks.value = [];
    }
  }

  async function fetchLocalNews() {
    try {
      const res = await newsAPI.getLocal();
      localNews.value = apiArray<NewsItem>(res);
    } catch {
      localNews.value = [];
    }
  }
  async function fetchNewsBySlug(slug: string) {
    loading.value = true;
    try { const res = await newsAPI.getBySlug(slug); currentNews.value = apiData<NewsItem | null>(res, null); return res; }
    catch { return null; }
    finally { loading.value = false; }
  }

  return { breakingNews, featuredNews, latestNews, trendingNews, editorsPicks, localNews, currentNews, loading,
    fetchBreakingNews, fetchFeaturedNews, fetchLatestNews, fetchTrendingNews, fetchEditorsPicks, fetchLocalNews, fetchNewsBySlug };
});
