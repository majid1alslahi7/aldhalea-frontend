<template>
  <nav v-if="tags.length" class="mt-8 flex flex-wrap items-center gap-2" aria-label="وسوم المادة">
    <span class="text-sm font-bold text-gray-500">وسوم:</span>
    <RouterLink
      v-for="tag in tags"
      :key="tag.id"
      :to="`/tags/${slugValue(tag.slug)}`"
      class="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-600 transition hover:border-primary-300 hover:text-primary-700"
    >
      {{ localizedText(tag.name) }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import type { TagItem } from '@/types/api';
import { localizedText, slugValue } from '@/utils/content';

defineProps<{
  tags: TagItem[];
}>();
</script>
