<template>
  <nav v-if="previous || next" class="mt-10 grid gap-4 md:grid-cols-2" aria-label="التنقل بين المواد">
    <RouterLink v-if="previous" :to="`${basePath}/${slugValue(previous.slug)}`" class="nav-card">
      <span class="text-xs font-bold text-gray-400">السابق</span>
      <span class="mt-2 line-clamp-2 font-extrabold leading-7 text-gray-900">{{ localizedText(previous.title) }}</span>
    </RouterLink>
    <div v-else></div>

    <RouterLink v-if="next" :to="`${basePath}/${slugValue(next.slug)}`" class="nav-card text-left md:text-right">
      <span class="text-xs font-bold text-gray-400">التالي</span>
      <span class="mt-2 line-clamp-2 font-extrabold leading-7 text-gray-900">{{ localizedText(next.title) }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import type { ArticleItem, NewsItem } from '@/types/api';
import { localizedText, slugValue } from '@/utils/content';

defineProps<{
  previous?: NewsItem | ArticleItem | null;
  next?: NewsItem | ArticleItem | null;
  basePath: string;
}>();
</script>

<style scoped>
.nav-card {
  display: block;
  border: 1px solid var(--border);
  border-radius: .5rem;
  background: var(--surface);
  padding: 1rem;
  transition: border-color .2s ease, transform .2s ease;
}

.nav-card:hover {
  border-color: color-mix(in srgb, var(--brand-blue) 30%, var(--border));
  transform: translateY(-1px);
}
</style>
