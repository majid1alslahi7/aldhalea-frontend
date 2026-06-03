import { defineStore } from 'pinia';
import { ref } from 'vue';
import { newsAPI } from '@/api/news';

export const useNewsStore = defineStore('news', () => {
  const breakingNews = ref<any[]>([]);
  const featuredNews = ref<any[]>([]);
  const latestNews = ref<any[]>([]);
  const trendingNews = ref<any[]>([]);
  const editorsPicks = ref<any[]>([]);
  const localNews = ref<any[]>([]);
  const currentNews = ref<any>(null);
  const loading = ref(false);

  async function fetchBreakingNews() { const res: any = await newsAPI.getBreaking(); breakingNews.value = res.data; }
  async function fetchFeaturedNews() { const res: any = await newsAPI.getFeatured(); featuredNews.value = res.data; }
  async function fetchLatestNews(page = 1) {
    loading.value = true;
    const res: any = await newsAPI.getLatest(page);
    latestNews.value = page === 1 ? res.data : [...latestNews.value, ...res.data];
    loading.value = false;
    return res.pagination;
  }
  async function fetchTrendingNews(days = 7) { const res: any = await newsAPI.getTrending(days); trendingNews.value = res.data; }
  async function fetchEditorsPicks() { const res: any = await newsAPI.getEditorsPicks(); editorsPicks.value = res.data; }
  async function fetchLocalNews() { const res: any = await newsAPI.getLocal(); localNews.value = res.data; }
  async function fetchNewsBySlug(slug: string) {
    loading.value = true;
    try { const res: any = await newsAPI.getBySlug(slug); currentNews.value = res.data; return res; }
    catch { return null; }
    finally { loading.value = false; }
  }

  return { breakingNews, featuredNews, latestNews, trendingNews, editorsPicks, localNews, currentNews, loading,
    fetchBreakingNews, fetchFeaturedNews, fetchLatestNews, fetchTrendingNews, fetchEditorsPicks, fetchLocalNews, fetchNewsBySlug };
});
