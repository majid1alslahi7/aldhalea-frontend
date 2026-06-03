<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 border-b border-gray-100 pb-6">
        <p class="text-sm font-bold text-red-600">دليل الموضوعات</p>
        <h1 class="mt-2 text-3xl font-extrabold text-primary-950">الوسوم</h1>
        <p class="mt-3 max-w-3xl leading-8 text-gray-500">تصفح الأخبار والمقالات حسب الملفات والموضوعات الأكثر حضوراً في الضالع واليمن.</p>
      </header>

      <div v-if="loading && !tags.length" class="card p-8 text-center text-gray-500">جار تحميل الوسوم...</div>
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <router-link v-for="tag in tags" :key="tag.id" :to="`/tags/${slugValue(tag.slug)}`" class="card p-5 transition hover:-translate-y-1">
          <div class="mb-4 h-2 w-16 rounded-full" :style="{ background: tag.color || '#154da5' }"></div>
          <h2 class="text-xl font-extrabold">{{ localizedText(tag.name) }}</h2>
          <p class="mt-2 line-clamp-3 text-sm leading-7 text-gray-500">{{ localizedText(tag.description) || 'مواد مرتبطة بهذا الملف التحريري.' }}</p>
          <div class="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>{{ tag.news_count || 0 }} مادة</span>
            <span v-if="tag.is_trending" class="rounded-full bg-red-50 px-2 py-1 text-xs text-red-600">رائج</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { tagAPI } from '@/api/news';
import type { TagItem } from '@/types/api';
import { apiArray, localizedText, slugValue } from '@/utils/content';
import { fallbackTags } from '@/data/curatedContent';
import { applySeo } from '@/utils/seo';

const tags = ref<TagItem[]>(fallbackTags);
const loading = ref(false);

onMounted(async () => {
  applySeo({ title: 'الوسوم', description: 'دليل وسوم الضالع أونلاين لتصفح الأخبار والمقالات حسب الموضوعات.', path: '/tags' });
  loading.value = true;
  try {
    const apiTags = apiArray<TagItem>(await tagAPI.getAll());
    if (apiTags.length) {
      const seen = new Set(fallbackTags.map((tag) => localizedText(tag.slug)));
      tags.value = [...fallbackTags, ...apiTags.filter((tag) => !seen.has(localizedText(tag.slug)))];
    }
  } finally {
    loading.value = false;
  }
});
</script>
