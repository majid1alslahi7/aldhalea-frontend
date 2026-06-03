<template>
  <component :is="to ? 'router-link' : 'article'" :to="to" class="card group block h-full">
    <img v-if="imageUrl" :src="imageUrl" :alt="title" class="h-44 w-full object-cover" />
    <div class="p-4">
      <div class="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span v-if="label" class="rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">{{ label }}</span>
        <span v-if="category" class="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{{ category }}</span>
      </div>
      <h3 class="line-clamp-2 text-lg font-extrabold leading-7 transition group-hover:text-primary-700">{{ title }}</h3>
      <p v-if="excerpt" class="mt-2 line-clamp-3 text-sm leading-7 text-gray-500">{{ excerpt }}</p>
      <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
        <span v-if="author" class="flex items-center gap-1"><User :size="14" /> {{ author }}</span>
        <span v-if="dateText" class="flex items-center gap-1"><Clock :size="14" /> {{ dateText }}</span>
        <span v-if="views !== undefined" class="flex items-center gap-1"><Eye :size="14" /> {{ views }}</span>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { Clock, Eye, User } from '@lucide/vue';

defineProps<{
  title: string;
  excerpt?: string;
  imageUrl?: string | null;
  to?: string;
  label?: string;
  category?: string;
  author?: string;
  dateText?: string | null;
  views?: number;
}>();
</script>
