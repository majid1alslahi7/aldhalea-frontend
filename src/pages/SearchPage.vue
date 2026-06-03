<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-extrabold mb-2">نتائج البحث</h1>
      <p class="text-gray-500 mb-8" v-if="query">نتائج البحث عن: <strong>{{ query }}</strong></p>
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 :size="40" class="animate-spin text-primary-600" />
      </div>
      <div v-else-if="results.length" class="space-y-4">
        <div v-for="item in results" :key="item.data?.id" class="card p-4">
          <h3 class="font-bold text-lg">{{ typeof item.data?.title === 'object' ? item.data.title.ar : item.data?.title }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ item.type }}</p>
        </div>
      </div>
      <p v-else class="text-center text-gray-500 py-20">لا توجد نتائج</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Loader2 } from '@lucide/vue';
import { searchAPI } from '@/api/news';

const route = useRoute();
const query = ref('');
const results = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  query.value = (route.query.q as string) || '';
  if (query.value) {
    try {
      const res: any = await searchAPI.search(query.value);
      results.value = res.data?.results || [];
    } catch (e) {}
  }
  loading.value = false;
});
</script>
