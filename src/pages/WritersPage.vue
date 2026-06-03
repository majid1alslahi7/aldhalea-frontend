<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 border-b border-gray-100 pb-6">
        <p class="text-sm font-bold text-red-600">أقلام الموقع</p>
        <h1 class="mt-2 text-3xl font-extrabold text-primary-950">الكتّاب</h1>
        <p class="mt-3 max-w-3xl leading-8 text-gray-500">تعرف على كتّاب ومحرري الضالع أونلاين وتصفح أحدث مقالاتهم وتحليلاتهم.</p>
      </header>

      <div v-if="loading && !writers.length" class="card p-8 text-center text-gray-500">جار تحميل الكتّاب...</div>
      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <router-link v-for="writer in writers" :key="writer.id" :to="`/writers/${writer.id}`" class="card p-5">
          <div class="flex items-start gap-4">
            <img :src="writer.avatar || avatarUrl(writer.name)" :alt="writer.name" class="h-16 w-16 rounded-full object-cover" />
            <div>
              <h2 class="text-xl font-extrabold">{{ writer.name }}</h2>
              <p class="mt-1 text-sm text-gray-400">{{ writer.username || 'كاتب في الضالع أونلاين' }}</p>
            </div>
          </div>
          <p class="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">{{ writer.bio || 'كاتب ومحرر في الضالع أونلاين.' }}</p>
          <div class="mt-5 flex justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
            <span>{{ writer.total_articles || 0 }} مقال</span>
            <span>{{ writer.total_views || 0 }} قراءة</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { writerAPI } from '@/api/news';
import type { Writer } from '@/types/api';
import { apiArray } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { fallbackWriters } from '@/data/curatedContent';

const writers = ref<Writer[]>(fallbackWriters);
const loading = ref(false);

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=051836&color=fff`;
}

onMounted(async () => {
  applySeo({ title: 'الكتّاب', description: 'قائمة كتّاب ومحرري الضالع أونلاين ومقالاتهم.', path: '/writers' });
  loading.value = true;
  try {
    const apiWriters = apiArray<Writer>(await writerAPI.getAll());
    if (apiWriters.length) {
      const seen = new Set(fallbackWriters.map((item) => item.name));
      writers.value = [...fallbackWriters, ...apiWriters.filter((item) => !seen.has(item.name))];
    }
  } finally {
    loading.value = false;
  }
});
</script>
