<template>
  <section class="mt-10 card p-5 md:p-6">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-xl font-extrabold">تعليقات القراء</h2>
      <span class="text-sm text-gray-400">{{ comments.length }} تعليق</span>
    </div>

    <div v-if="loading" class="py-8 text-center text-sm text-gray-500">جار تحميل التعليقات...</div>
    <div v-else-if="comments.length" class="space-y-4">
      <article v-for="comment in comments" :key="comment.id" class="rounded-lg border border-gray-100 p-4">
        <div class="mb-2 flex items-center gap-3">
          <img :src="comment.user?.avatar || avatarUrl(comment.user?.name)" :alt="comment.user?.name || 'قارئ'" class="h-10 w-10 rounded-full object-cover" />
          <div>
            <h3 class="font-bold">{{ comment.user?.name || 'قارئ الضالع أونلاين' }}</h3>
            <p class="text-xs text-gray-400">{{ comment.time_ago || formatDate(comment.created_at) }}</p>
          </div>
        </div>
        <p class="leading-8 text-gray-600">{{ comment.content }}</p>
      </article>
    </div>
    <p v-else class="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-500">لا توجد تعليقات منشورة بعد.</p>

    <div class="mt-5 rounded-lg border border-dashed border-gray-200 p-4 text-sm leading-7 text-gray-500">
      إضافة التعليقات مرتبطة بتسجيل الدخول في الباك اند. سيتم إظهار نموذج الإرسال هنا عند تفعيل دخول القراء.
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { commentAPI } from '@/api/news';
import type { CommentItem } from '@/types/api';
import { apiArray } from '@/utils/content';

const props = defineProps<{ type: string; itemId?: number | string | null }>();
const comments = ref<CommentItem[]>([]);
const loading = ref(false);

function avatarUrl(name?: string | null) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Aldhalea')}&background=051836&color=fff`;
}

function formatDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ar-YE');
}

async function loadComments() {
  if (!props.itemId) return;
  loading.value = true;
  try {
    const res = await commentAPI.getAll(props.type, props.itemId);
    comments.value = apiArray<CommentItem>(res);
  } catch {
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

watch(() => props.itemId, loadComments);
onMounted(loadComments);
</script>
