import { defineStore } from 'pinia';
import { ref } from 'vue';
import { newsAPI } from '@/api/news';
import type { ApiEnvelope, NewsItem } from '@/types/api';
import { apiArray, apiData } from '@/utils/content';
import { fallbackNews, mergeNewsWithFallback, newsBySlug } from '@/data/curatedContent';

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
      const items = apiArray<NewsItem>(res);
      breakingNews.value = mergeNewsWithFallback(items, fallbackNews.filter((item) => item.priority === 'breaking')).slice(0, 10);
    } catch {
      breakingNews.value = fallbackNews.filter((item) => item.priority === 'breaking').slice(0, 10);
    }
  }

  async function fetchFeaturedNews() {
    try {
      const res = await newsAPI.getFeatured();
      const items = apiArray<NewsItem>(res);
      featuredNews.value = mergeNewsWithFallback(items, fallbackNews.filter((item) => item.priority === 'featured')).slice(0, 5);
    } catch {
      featuredNews.value = fallbackNews.filter((item) => item.priority === 'featured').slice(0, 5);
    }
  }
  async function fetchLatestNews(page = 1) {
    loading.value = true;
    try {
      const res = await newsAPI.getLatest(page);
      const items = apiArray<NewsItem>(res);
      latestNews.value = page === 1 ? mergeNewsWithFallback(items) : [...latestNews.value, ...items];
      return (res as Partial<ApiEnvelope<NewsItem[]>>).pagination;
    } catch {
      if (page === 1) latestNews.value = fallbackNews;
      return null;
    } finally {
      loading.value = false;
    }
  }
  async function fetchTrendingNews(days = 7) {
    const popularFallback = fallbackNews.slice(0, 10);
    try {
      const res = await newsAPI.getTrending(days);
      const items = apiArray<NewsItem>(res);
      trendingNews.value = mergeNewsWithFallback(items, popularFallback).slice(0, 10);
    } catch {
      trendingNews.value = popularFallback;
    }
  }

  async function fetchEditorsPicks() {
    const picksFallback = fallbackNews.filter((item) => item.priority === 'editors_pick' || item.priority === 'featured').slice(0, 6);
    try {
      const res = await newsAPI.getEditorsPicks();
      const items = apiArray<NewsItem>(res);
      editorsPicks.value = mergeNewsWithFallback(items, picksFallback).slice(0, 6);
    } catch {
      editorsPicks.value = picksFallback;
    }
  }

  async function fetchLocalNews() {
    try {
      const res = await newsAPI.getLocal();
      localNews.value = mergeNewsWithFallback(apiArray<NewsItem>(res));
    } catch {
      localNews.value = fallbackNews;
    }
  }
  async function fetchNewsBySlug(slug: string) {
    loading.value = true;
    try {
      const res = await newsAPI.getBySlug(slug);
      currentNews.value = newsBySlug(slug) || apiData<NewsItem | null>(res, null);
      return currentNews.value ? { success: true, data: currentNews.value } : res;
    }
    catch {
      currentNews.value = newsBySlug(slug);
      return currentNews.value ? { success: true, data: currentNews.value } : null;
    }
    finally { loading.value = false; }
  }

  return { breakingNews, featuredNews, latestNews, trendingNews, editorsPicks, localNews, currentNews, loading,
    fetchBreakingNews, fetchFeaturedNews, fetchLatestNews, fetchTrendingNews, fetchEditorsPicks, fetchLocalNews, fetchNewsBySlug };
});
