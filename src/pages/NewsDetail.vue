<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-20"><Loader2 :size="40" class="animate-spin text-primary-600" /></div>
      <div v-else-if="news" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article class="lg:col-span-2">
          <span class="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full mb-4">{{ localizedText(news.category?.name) }}</span>
          <h1 class="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{{ localizedText(news.title) }}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <span class="flex items-center gap-1"><User :size="16" /> {{ news.writer?.name || 'الضالع أونلاين' }}</span>
            <span class="flex items-center gap-1"><Calendar :size="16" /> {{ news.published_date }}</span>
            <span class="flex items-center gap-1"><Clock :size="16" /> {{ news.reading_time?.formatted }}</span>
            <span class="flex items-center gap-1"><Eye :size="16" /> {{ news.stats?.views }}</span>
          </div>
          <img v-if="news.main_image" :src="news.main_image" class="w-full rounded-2xl mb-8 shadow-lg" />
          <div class="prose prose-lg max-w-none article-content" v-html="safeContent"></div>
          <div class="flex items-center gap-3 mt-8 pt-6 border-t">
            <span class="text-sm text-gray-500">شارك:</span>
            <button class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center"><Share2 :size="18" /></button>
            <button class="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center"><Send :size="18" /></button>
          </div>
        </article>
        <aside class="space-y-8">
          <div v-if="news.writer" class="card p-5 text-center">
            <img :src="news.writer.avatar || 'https://ui-avatars.com/api/?name=' + news.writer.name" class="w-20 h-20 rounded-full mx-auto mb-3" />
            <h4 class="font-bold">{{ news.writer.name }}</h4>
            <p class="text-sm text-gray-500 mt-1">{{ news.writer.bio }}</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Loader2, User, Calendar, Clock, Eye, Share2, Send } from '@lucide/vue';
import { useNewsStore } from '@/stores/news';
import type { NewsItem } from '@/types/api';
import { apiData, localizedText, sanitizeHtml } from '@/utils/content';

const route = useRoute();
const newsStore = useNewsStore();
const news = ref<NewsItem | null>(null);
const loading = ref(true);

const safeContent = computed(() => sanitizeHtml(news.value?.content));

onMounted(async () => {
  const slug = route.params.slug as string;
  const result = await newsStore.fetchNewsBySlug(slug);
  if (result) news.value = apiData<NewsItem | null>(result, null);
  loading.value = false;
});
</script>
