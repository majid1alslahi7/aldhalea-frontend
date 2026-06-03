<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-3xl px-4 py-8">
      <article v-if="poll" class="card p-5 md:p-8">
        <p class="text-sm font-bold text-red-600">استطلاع رأي</p>
        <h1 class="mt-2 text-3xl font-extrabold leading-10 text-primary-950">{{ localizedText(poll.question) }}</h1>
        <p class="mt-3 leading-8 text-gray-500">{{ localizedText(poll.description) }}</p>

        <div class="mt-8 space-y-3">
          <button
            v-for="option in poll.options"
            :key="option.id"
            class="relative w-full overflow-hidden rounded-lg border border-gray-200 p-4 text-right transition hover:border-primary-300"
            :disabled="voted || submitting || option.id < 0"
            @click="vote(option.id)"
          >
            <div class="absolute inset-y-0 left-0 opacity-20" :style="{ width: `${option.percentage}%`, background: option.color || '#154da5' }"></div>
            <div class="relative flex items-center justify-between gap-4">
              <span class="font-bold">{{ localizedText(option.text) }}</span>
              <span class="text-primary-700">{{ option.percentage }}%</span>
            </div>
          </button>
        </div>

        <p v-if="message" class="mt-4 text-sm" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'">{{ message }}</p>
        <p class="mt-5 text-center text-sm text-gray-400">إجمالي المصوتين: {{ poll.total_votes }}</p>
      </article>
      <div v-else class="card p-8 text-center text-gray-500">الاستطلاع غير متاح حالياً.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { pollAPI } from '@/api/news';
import type { Poll } from '@/types/api';
import { apiData, errorMessage, localizedText } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { fallbackPolls, pollById } from '@/data/curatedContent';

const route = useRoute();
const poll = ref<Poll | null>(null);
const voted = ref(false);
const submitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

async function loadPoll() {
  const id = route.params.id as string;
  poll.value = pollById(id) || fallbackPolls[0];
  voted.value = false;
  try {
    const apiPoll = apiData<Poll | null>(await pollAPI.getById(id), null);
    if (apiPoll) poll.value = apiPoll;
  } catch {
    // fallback rendered
  } finally {
    applySeo({ title: localizedText(poll.value?.question) || 'استطلاع رأي', description: localizedText(poll.value?.description) || 'استطلاع رأي في الضالع أونلاين.', path: route.fullPath });
  }
}

async function vote(optionId: number) {
  if (!poll.value || voted.value || submitting.value || optionId < 0) {
    if (optionId < 0) {
      messageType.value = 'error';
      message.value = 'هذا استطلاع تجريبي من بيانات الموقع الاحتياطية، والتصويت الفعلي يعمل مع استطلاعات الباك اند.';
    }
    return;
  }

  submitting.value = true;
  try {
    const res = await pollAPI.vote(poll.value.id, optionId);
    const updated = apiData<Poll | null>(res, null);
    if (updated) poll.value = updated;
    voted.value = true;
    messageType.value = 'success';
    message.value = (res as { message?: string }).message || 'تم تسجيل تصويتك';
  } catch (e) {
    messageType.value = 'error';
    message.value = errorMessage(e, 'تعذر تسجيل التصويت');
  } finally {
    submitting.value = false;
  }
}

watch(() => route.params.id, loadPoll, { immediate: true });
</script>
