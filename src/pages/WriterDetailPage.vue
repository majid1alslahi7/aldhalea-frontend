<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 rounded-lg border border-gray-100 bg-white p-6">
        <div class="flex flex-col gap-5 md:flex-row md:items-center">
          <img :src="writer?.avatar || avatarUrl(writer?.name)" :alt="writer?.name || 'كاتب'" class="h-24 w-24 rounded-full object-cover" />
          <div>
            <p class="text-sm font-bold text-red-600">كاتب</p>
            <h1 class="mt-2 text-3xl font-extrabold text-primary-950">{{ writer?.name || 'كاتب الضالع أونلاين' }}</h1>
            <p class="mt-3 max-w-3xl leading-8 text-gray-500">{{ writer?.bio || 'كاتب ومحرر في الضالع أونلاين.' }}</p>
            <div class="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
              <span>{{ writer?.total_articles || articles.length }} مقال</span>
              <span>{{ writer?.total_views || 0 }} قراءة</span>
              <a v-if="writer?.website" :href="writer.website" target="_blank" rel="noopener noreferrer" class="text-primary-700 hover:underline">الموقع الشخصي</a>
            </div>
          </div>
        </div>
      </header>

      <h2 class="section-title">أحدث المقالات</h2>
      <div v-if="loading && !articles.length" class="card p-8 text-center text-gray-500">جار تحميل المقالات...</div>
      <div v-else-if="articles.length" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ContentCard
          v-for="article in articles"
          :key="article.id"
          :title="localizedText(article.title)"
          :excerpt="localizedText(article.excerpt)"
          :image-url="article.featured_image"
          :to="`/articles/${slugValue(article.slug)}`"
          label="مقال"
          :category="localizedText(article.category?.name)"
          :author="article.writer?.name || writer?.name"
          :date-text="article.published_diff || article.published_at"
          :views="article.stats?.views"
        />
      </div>
      <div v-else class="card p-8 text-center text-gray-500">لا توجد مقالات منشورة لهذا الكاتب حالياً.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ContentCard from '@/components/content/ContentCard.vue';
import { writerAPI } from '@/api/news';
import type { ArticleItem, Writer } from '@/types/api';
import { apiArray, apiData, localizedText, slugValue } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { fallbackArticles, fallbackWriters, writerById } from '@/data/curatedContent';

const route = useRoute();
const writer = ref<Writer | null>(null);
const articles = ref<ArticleItem[]>([]);
const loading = ref(false);

function avatarUrl(name?: string | null) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Aldhalea')}&background=051836&color=fff`;
}

async function loadWriter() {
  const id = route.params.id as string;
  loading.value = true;
  writer.value = writerById(id) || fallbackWriters[0];
  articles.value = fallbackArticles.map((article) => ({ ...article, writer: writer.value || article.writer }));

  try {
    const [writerRes, articlesRes] = await Promise.all([writerAPI.getById(id), writerAPI.getArticles(id)]);
    writer.value = writer.value || apiData<Writer | null>(writerRes, null);
    const apiArticles = apiArray<ArticleItem>(articlesRes);
    if (apiArticles.length) {
      const seen = new Set(articles.value.map((article) => localizedText(article.title)));
      articles.value = [...articles.value, ...apiArticles.filter((article) => !seen.has(localizedText(article.title)))];
    }
  } catch {
    // fallback rendered
  } finally {
    loading.value = false;
    applySeo({ title: writer.value?.name || 'كاتب', description: writer.value?.bio || 'صفحة كاتب في الضالع أونلاين.', path: route.fullPath });
  }
}

watch(() => route.params.id, loadWriter, { immediate: true });
</script>
