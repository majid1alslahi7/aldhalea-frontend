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
          <div v-if="news.source?.name" class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <span class="font-bold text-gray-800">مصدر المعلومات: </span>
            <a v-if="news.source.url" :href="news.source.url" target="_blank" rel="noopener noreferrer" class="text-primary-700 hover:underline">
              {{ news.source.name }}
            </a>
            <span v-else>{{ news.source.name }}</span>
          </div>
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
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Loader2, User, Calendar, Clock, Eye, Share2, Send } from '@lucide/vue';
import { useNewsStore } from '@/stores/news';
import type { NewsItem } from '@/types/api';
import { apiData, localizedText, sanitizeHtml, slugValue } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { assetUrl, routeUrl, site } from '@/utils/site';
import { newsBySlug } from '@/data/curatedContent';

const route = useRoute();
const newsStore = useNewsStore();
const news = ref<NewsItem | null>(null);
const loading = ref(true);

const safeContent = computed(() => sanitizeHtml(news.value?.content));

function updateSeo(slug: string) {
  if (!news.value) {
    applySeo({ title: 'الخبر غير متاح', description: site.description, path: `/news/${slug}`, noindex: true });
    return;
  }

  const title = localizedText(news.value.title);
  const description = localizedText(news.value.excerpt || news.value.subtitle) || site.description;
  const path = `/news/${slugValue(news.value.slug) || slug}`;
  const image = news.value.main_image || news.value.thumbnail || site.defaultImage;

  applySeo({
    title,
    description,
    path,
    image,
    type: 'article',
    publishedTime: news.value.published_date,
    author: news.value.writer?.name || site.name,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description,
      image: assetUrl(image),
      datePublished: news.value.published_date,
      author: { '@type': 'Person', name: news.value.writer?.name || site.name },
      publisher: { '@type': 'NewsMediaOrganization', name: site.name, logo: { '@type': 'ImageObject', url: assetUrl('/icons/pwa-512.png') } },
      mainEntityOfPage: routeUrl(path),
      articleSection: localizedText(news.value.category?.name),
      inLanguage: site.language,
    },
  });
}

async function loadNews(slug: string) {
  const activeSlug = slug;
  loading.value = true;
  news.value = null;
  const fallbackNews = newsBySlug(slug);

  if (fallbackNews) {
    news.value = fallbackNews;
    loading.value = false;
    updateSeo(slug);
  }

  const result = await newsStore.fetchNewsBySlug(slug);
  if (route.params.slug !== activeSlug) return;
  if (result) news.value = apiData<NewsItem | null>(result, null);
  loading.value = false;
  updateSeo(slug);
}

watch(() => route.params.slug, (slug) => loadNews(slug as string), { immediate: true });
</script>
