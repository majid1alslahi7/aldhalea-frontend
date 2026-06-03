<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-extrabold mb-2">نتائج البحث</h1>
      <p class="text-gray-500 mb-8" v-if="query">نتائج البحث عن: <strong>{{ query }}</strong></p>
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 :size="40" class="animate-spin text-primary-600" />
      </div>
      <p v-else-if="error" class="card p-6 text-center text-red-600">{{ error }}</p>
      <div v-else-if="results.length" class="space-y-4">
        <router-link v-for="item in results" :key="`${item.type}-${item.data?.id}`" :to="resultPath(item)" class="card p-4 block hover:border-primary-200">
          <h3 class="font-bold text-lg">{{ localizedText(item.data?.title) }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ item.type === 'news' ? 'خبر' : 'مقال' }}</p>
        </router-link>
      </div>
      <p v-else class="text-center text-gray-500 py-20">لا توجد نتائج</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Loader2 } from '@lucide/vue';
import { searchAPI } from '@/api/news';
import type { SearchResult } from '@/types/api';
import { apiData, errorMessage, localizedText, slugValue } from '@/utils/content';
import { searchFallback } from '@/data/curatedContent';
import { applySeo } from '@/utils/seo';

const route = useRoute();
const query = ref('');
const results = ref<SearchResult[]>([]);
const loading = ref(true);
const error = ref('');

async function runSearch() {
  query.value = ((route.query.q as string) || '').trim();
  results.value = [];
  error.value = '';
  loading.value = true;
  const activeQuery = query.value;

  if (query.value.length >= 2) {
    const fallbackResults = searchFallback(query.value);
    results.value = fallbackResults;
    loading.value = fallbackResults.length === 0;
    updateSearchSeo();

    try {
      const res = await searchAPI.search(query.value);
      if (activeQuery !== query.value) return;
      const apiResults = apiData<{ results: SearchResult[] }>(res, { results: [] }).results || [];
      const seen = new Set(fallbackResults.map((item) => `${item.type}-${localizedText(item.data.title)}`));
      results.value = [...fallbackResults, ...apiResults.filter((item) => !seen.has(`${item.type}-${localizedText(item.data.title)}`))];
    } catch (e) {
      if (activeQuery !== query.value) return;
      results.value = fallbackResults;
      error.value = results.value.length ? '' : errorMessage(e, 'تعذر تنفيذ البحث');
    }
  }

  loading.value = false;
  updateSearchSeo();
}

function updateSearchSeo() {
  applySeo({
    title: query.value ? `بحث: ${query.value}` : 'البحث',
    description: query.value ? `نتائج البحث عن ${query.value} في أخبار ومقالات الضالع أونلاين.` : 'ابحث في أرشيف أخبار ومقالات وتقارير الضالع أونلاين.',
    path: query.value ? `/search?q=${encodeURIComponent(query.value)}` : '/search',
  });
}

function resultPath(item: SearchResult) {
  return item.type === 'article'
    ? `/articles/${slugValue(item.data.slug)}`
    : `/news/${slugValue(item.data.slug)}`;
}

watch(() => route.query.q, runSearch, { immediate: true });
</script>
