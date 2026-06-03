<template>
  <div class="min-h-screen bg-gray-50">
    <BreakingTicker :items="newsStore.breakingNews" />

    <div class="container-custom py-6">
      <!-- الهيرو -->
      <section v-if="newsStore.featuredNews.length" class="mb-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 card cursor-pointer" @click="goToNews(newsStore.featuredNews[0])">
            <div class="relative aspect-[16/9] overflow-hidden">
              <img :src="newsStore.featuredNews[0]?.main_image || 'https://picsum.photos/800/450'" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div class="absolute bottom-0 right-0 p-6 text-white">
                <span class="inline-block px-3 py-1 bg-primary-600 text-xs rounded-full mb-3">{{ localizedText(newsStore.featuredNews[0]?.category?.name) }}</span>
                <h2 class="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">{{ localizedText(newsStore.featuredNews[0]?.title) }}</h2>
                <p class="text-white/80 text-sm line-clamp-2">{{ localizedText(newsStore.featuredNews[0]?.excerpt) }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="news in newsStore.featuredNews.slice(1, 4)" :key="news.id" class="card flex gap-4 p-3 cursor-pointer" @click="goToNews(news)">
              <img :src="news.thumbnail || 'https://picsum.photos/120/120'" class="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <span class="text-xs text-primary-600 font-medium">{{ localizedText(news.category?.name) }}</span>
                <h3 class="font-bold text-sm mt-1 line-clamp-2 hover:text-primary-600 transition">{{ localizedText(news.title) }}</h3>
                <span class="text-xs text-gray-400 mt-2 block">{{ news.published_diff }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- أحدث الأخبار + الشريط الجانبي -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <h2 class="section-title">📰 أحدث الأخبار</h2>
          <div v-if="newsStore.loading && !newsStore.latestNews.length" class="card p-6 text-center text-gray-500">
            جار تحميل الأخبار...
          </div>
          <div v-else-if="newsStore.latestNews.length" class="space-y-4">
            <div v-for="news in newsStore.latestNews" :key="news.id" class="card flex flex-col sm:flex-row gap-4 p-4 cursor-pointer" @click="goToNews(news)">
              <img :src="news.thumbnail || news.main_image || 'https://picsum.photos/300/200'" class="w-full sm:w-48 h-36 object-cover rounded-xl flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">{{ localizedText(news.category?.name) }}</span>
                </div>
                <h3 class="font-bold text-lg mb-1 line-clamp-2 hover:text-primary-600 transition">{{ localizedText(news.title) }}</h3>
                <p class="text-gray-500 text-sm line-clamp-2 mb-3">{{ localizedText(news.excerpt) }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-400">
                  <span class="flex items-center gap-1"><Eye :size="14" /> {{ news.stats?.views }}</span>
                  <span class="flex items-center gap-1"><MessageCircle :size="14" /> {{ news.stats?.comments }}</span>
                  <span>{{ news.published_diff }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="card p-6 text-center text-gray-500">
            لا توجد أخبار متاحة حالياً
          </div>
          <div v-if="newsStore.latestNews.length" class="text-center mt-8">
            <button class="btn-primary" @click="loadMore" :disabled="newsStore.loading">{{ newsStore.loading ? 'جار التحميل...' : 'تحميل المزيد' }}</button>
          </div>
        </div>

        <aside class="space-y-8">
          <div class="card p-5">
            <h3 class="font-bold text-lg mb-4">⭐ اختيارات المحرر</h3>
            <div class="space-y-4">
              <div v-for="news in newsStore.editorsPicks" :key="news.id" class="flex gap-3 cursor-pointer" @click="goToNews(news)">
                <img :src="news.thumbnail || 'https://picsum.photos/80/80'" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <h4 class="text-sm font-medium line-clamp-2 hover:text-primary-600 transition">{{ localizedText(news.title) }}</h4>
                  <span class="text-xs text-gray-400">{{ news.published_diff }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-5">
            <h3 class="font-bold text-lg mb-4">🔥 الأكثر قراءة</h3>
            <div class="space-y-4">
              <div v-for="(news, i) in newsStore.trendingNews" :key="news.id" class="flex gap-3 cursor-pointer" @click="goToNews(news)">
                <span class="text-2xl font-extrabold text-primary-200 w-8">{{ i + 1 }}</span>
                <div>
                  <h4 class="text-sm font-medium line-clamp-2 hover:text-primary-600 transition">{{ localizedText(news.title) }}</h4>
                  <span class="text-xs text-gray-400">{{ news.stats?.views }} مشاهدة</span>
                </div>
              </div>
            </div>
          </div>

          <PollWidget />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, MessageCircle } from '@lucide/vue';
import { useNewsStore } from '@/stores/news';
import BreakingTicker from '@/components/layout/BreakingTicker.vue';
import PollWidget from '@/components/interactive/PollWidget.vue';
import type { NewsItem } from '@/types/api';
import { localizedText, slugValue } from '@/utils/content';

const router = useRouter();
const newsStore = useNewsStore();
const page = ref(1);

function goToNews(news: NewsItem) {
  router.push(`/news/${slugValue(news.slug)}`);
}

async function loadMore() { page.value++; await newsStore.fetchLatestNews(page.value); }

onMounted(async () => {
  await Promise.allSettled([
    newsStore.fetchBreakingNews(), newsStore.fetchFeaturedNews(),
    newsStore.fetchLatestNews(), newsStore.fetchTrendingNews(),
    newsStore.fetchEditorsPicks(),
  ]);
});
</script>
