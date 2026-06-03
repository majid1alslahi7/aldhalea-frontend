<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 :size="40" class="animate-spin text-primary-600" />
      </div>

      <article v-else-if="article" class="card p-5 md:p-8">
        <span v-if="article.category" class="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full mb-4">
          {{ localizedText(article.category.name) }}
        </span>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{{ localizedText(article.title) }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
          <span v-if="article.writer" class="flex items-center gap-1"><User :size="16" /> {{ article.writer.name }}</span>
          <span v-if="article.published_diff" class="flex items-center gap-1"><Clock :size="16" /> {{ article.published_diff }}</span>
          <span class="flex items-center gap-1"><Eye :size="16" /> {{ article.stats?.views || 0 }}</span>
        </div>
        <img v-if="article.featured_image" :src="article.featured_image" class="w-full rounded-2xl mb-8 shadow-lg" />
        <div class="prose prose-lg max-w-none article-content" v-html="safeContent"></div>
      </article>

      <div v-else class="card p-8 text-center text-gray-500">
        المقال غير متاح حالياً
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Clock, Eye, Loader2, User } from '@lucide/vue';
import { articleAPI } from '@/api/news';
import type { ArticleItem } from '@/types/api';
import { apiData, localizedText, sanitizeHtml } from '@/utils/content';
import { articleBySlug } from '@/data/curatedContent';

const route = useRoute();
const article = ref<ArticleItem | null>(null);
const loading = ref(true);

const safeContent = computed(() => sanitizeHtml(article.value?.content));

onMounted(async () => {
  const slug = route.params.slug as string;
  try {
    const res = await articleAPI.getBySlug(slug);
    article.value = articleBySlug(slug) || apiData<ArticleItem | null>(res, null);
  } catch {
    article.value = articleBySlug(slug);
  } finally {
    loading.value = false;
  }
});
</script>
