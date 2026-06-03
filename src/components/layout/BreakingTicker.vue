<template>
  <div v-if="items.length" class="breaking-ticker">
    <div class="container-custom flex items-center gap-3">
      <div class="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full flex-shrink-0">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span class="text-xs font-bold">عاجل</span>
      </div>
      <div class="overflow-hidden flex-1">
        <div class="animate-ticker whitespace-nowrap inline-block">
          <span v-for="item in items" :key="item.id" class="mx-8 text-sm font-medium">
            {{ typeof item.title === 'object' ? item.title.ar : item.title }}
            <span class="mx-2 text-white/50">|</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: any[] }>();
</script>

<style scoped>
@keyframes ticker { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
.animate-ticker { animation: ticker 30s linear infinite; }
</style>
