<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <h1 class="text-3xl font-extrabold mb-8">{{ categoryName || 'أخبار التصنيف' }}</h1>

      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 :size="40" class="animate-spin text-primary-600" />
      </div>
      <p v-else-if="error" class="card p-6 text-center text-red-600">{{ error }}</p>
      <div v-else-if="newsList.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="news in newsList" :key="news.id" class="card p-4 cursor-pointer" @click="$router.push(`/news/${slugValue(news.slug)}`)">
          <img :src="news.thumbnail || 'https://picsum.photos/400/250'" class="w-full h-48 object-cover rounded-xl mb-3" />
          <h3 class="font-bold line-clamp-2">{{ localizedText(news.title) }}</h3>
        </div>
      </div>
      <p v-else class="card p-6 text-center text-gray-500">لا توجد أخبار منشورة في هذا التصنيف حالياً</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Loader2 } from '@lucide/vue';
import { categoryAPI } from '@/api/news';
import type { Category, NewsItem } from '@/types/api';
import { apiArray, apiData, errorMessage, localizedText, slugValue } from '@/utils/content';
import { categoryByRouteSlug, mergeNewsWithFallback, newsByCategory } from '@/data/curatedContent';
import { applySeo } from '@/utils/seo';
import { routeUrl, site } from '@/utils/site';

const route = useRoute();
const category = ref<Category | null>(null);
const newsList = ref<NewsItem[]>([]);
const loading = ref(true);
const error = ref('');

const categoryName = computed(() => localizedText(category.value?.name));

function updateSeo(slug: string) {
  const title = categoryName.value || 'أخبار التصنيف';
  const description = `تابع ${title} من الضالع أونلاين: أخبار وتقارير ومقالات محدثة من الواقع اليمني والمحلي.`;

  applySeo({
    title,
    description,
    path: `/category/${slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: routeUrl(`/category/${slug}`),
      isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
      mainEntity: newsList.value.slice(0, 12).map((item) => ({
        '@type': 'NewsArticle',
        headline: localizedText(item.title),
        url: routeUrl(`/news/${slugValue(item.slug)}`),
      })),
    },
  });
}

async function loadCategory(slug: string) {
  const activeSlug = slug;
  loading.value = true;
  error.value = '';
  category.value = null;
  newsList.value = [];
  const fallbackCategory = categoryByRouteSlug(slug);
  const fallbackNews = newsByCategory(slug);

  if (fallbackCategory || fallbackNews.length) {
    category.value = fallbackCategory;
    newsList.value = fallbackNews;
    loading.value = false;
    updateSeo(slug);
  }

  try {
    const [categoryRes, newsRes] = await Promise.all([
      categoryAPI.getBySlug(slug),
      categoryAPI.getNews(slug),
    ]);
    if (route.params.slug !== activeSlug) return;
    category.value = fallbackCategory || apiData<Category | null>(categoryRes, null);
    newsList.value = mergeNewsWithFallback(apiArray<NewsItem>(newsRes), fallbackNews);
  } catch (e) {
    if (route.params.slug !== activeSlug) return;
    category.value = fallbackCategory;
    newsList.value = fallbackNews;
    error.value = newsList.value.length ? '' : errorMessage(e, 'تعذر تحميل أخبار التصنيف');
  } finally {
    if (route.params.slug !== activeSlug) return;
    loading.value = false;
    updateSeo(slug);
  }
}

watch(() => route.params.slug, (slug) => loadCategory(slug as string), { immediate: true });
</script>
