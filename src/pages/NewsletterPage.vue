<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 border-b border-gray-100 pb-6">
        <p class="text-sm font-bold text-red-600">تواصل تحريري</p>
        <h1 class="mt-2 text-3xl font-extrabold text-primary-950">النشرة البريدية</h1>
        <p class="mt-3 max-w-3xl leading-8 text-gray-500">اشترك في نشرة مختصرة تجمع أهم الأخبار والتحقيقات والمقالات التي تستحق القراءة.</p>
      </header>

      <NewsletterBox />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import NewsletterBox from '@/components/content/NewsletterBox.vue';
import { applySeo } from '@/utils/seo';

onMounted(() => applySeo({ title: 'النشرة البريدية', description: 'اشترك في النشرة البريدية للضالع أونلاين.', path: '/newsletter' }));
</script>
