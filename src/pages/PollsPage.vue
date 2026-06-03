<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 border-b border-gray-100 pb-6">
        <p class="text-sm font-bold text-red-600">رأي القراء</p>
        <h1 class="mt-2 text-3xl font-extrabold text-primary-950">استطلاعات الرأي</h1>
        <p class="mt-3 max-w-3xl leading-8 text-gray-500">شارك في الاستطلاعات وتابع مؤشرات اهتمام القراء بالقضايا المحلية والخدمية.</p>
      </header>

      <div v-if="loading && !polls.length" class="card p-8 text-center text-gray-500">جار تحميل الاستطلاعات...</div>
      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <router-link v-for="poll in polls" :key="poll.id" :to="`/polls/${poll.id}`" class="card p-5">
          <div class="mb-4 flex items-center justify-between text-sm">
            <span class="rounded-full bg-primary-50 px-3 py-1 text-primary-700">{{ poll.is_active ? 'نشط' : 'مؤرشف' }}</span>
            <span class="text-gray-400">{{ poll.total_votes || 0 }} صوت</span>
          </div>
          <h2 class="text-xl font-extrabold leading-8">{{ localizedText(poll.question) }}</h2>
          <p class="mt-2 line-clamp-2 text-sm leading-7 text-gray-500">{{ localizedText(poll.description) }}</p>
          <div class="mt-5 space-y-2">
            <div v-for="option in poll.options.slice(0, 3)" :key="option.id" class="overflow-hidden rounded-lg bg-gray-100">
              <div class="px-3 py-2 text-sm" :style="{ width: `${Math.max(option.percentage, 12)}%`, background: option.color || '#d8e8ff' }">
                {{ localizedText(option.text) }} - {{ option.percentage }}%
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { pollAPI } from '@/api/news';
import type { Poll } from '@/types/api';
import { apiArray, localizedText } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { fallbackPolls } from '@/data/curatedContent';

const polls = ref<Poll[]>(fallbackPolls);
const loading = ref(false);

onMounted(async () => {
  applySeo({ title: 'استطلاعات الرأي', description: 'استطلاعات رأي قراء الضالع أونلاين حول الخدمات والقضايا المحلية.', path: '/polls' });
  loading.value = true;
  try {
    const apiPolls = apiArray<Poll>(await pollAPI.getAll());
    if (apiPolls.length) polls.value = [...fallbackPolls, ...apiPolls];
  } finally {
    loading.value = false;
  }
});
</script>
