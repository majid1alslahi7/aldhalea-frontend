<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <h1 class="text-3xl font-extrabold mb-8">أخبار التصنيف</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="news in newsList" :key="news.id" class="card p-4 cursor-pointer" @click="$router.push(`/news/${news.slug?.ar || news.slug}`)">
          <img :src="news.thumbnail || 'https://picsum.photos/400/250'" class="w-full h-48 object-cover rounded-xl mb-3" />
          <h3 class="font-bold line-clamp-2">{{ typeof news.title === 'object' ? news.title.ar : news.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { categoryAPI } from '@/api/news';

const route = useRoute();
const newsList = ref<any[]>([]);

onMounted(async () => {
  const slug = route.params.slug as string;
  const res: any = await categoryAPI.getNews(slug);
  newsList.value = res.data;
});
</script>
