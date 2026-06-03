<template>
  <div v-if="poll" class="card p-5">
    <h3 class="font-bold text-lg mb-4">📊 استطلاع رأي</h3>
    <p class="font-medium text-sm mb-4">{{ localizedText(poll.question) }}</p>
    <div class="space-y-2">
      <button v-for="option in poll.options" :key="option.id" @click="vote(option.id)" :disabled="voted || submitting"
        class="w-full text-right p-3 rounded-xl border-2 transition-all relative overflow-hidden"
        :class="voted && selectedOption === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400'">
        <div class="flex justify-between items-center relative z-10">
          <span class="text-sm font-medium">{{ localizedText(option.text) }}</span>
          <span v-if="voted" class="text-sm font-bold text-primary-600">{{ option.percentage }}%</span>
        </div>
        <div v-if="voted" class="absolute inset-y-0 left-0 bg-primary-100 transition-all duration-500" :style="{ width: option.percentage + '%' }"></div>
      </button>
    </div>
    <p v-if="message" class="text-xs mt-3 text-center" :class="messageType === 'error' ? 'text-red-500' : 'text-green-600'">{{ message }}</p>
    <p class="text-xs text-gray-400 mt-3 text-center">إجمالي المصوتين: {{ totalVotes }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { pollAPI } from '@/api/news';
import type { Poll } from '@/types/api';
import { apiArray, apiData, errorMessage, localizedText } from '@/utils/content';
import { fallbackPolls } from '@/data/curatedContent';

const poll = ref<Poll | null>(null);
const voted = ref(false);
const selectedOption = ref<number | null>(null);
const submitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const totalVotes = computed(() => {
  if (!poll.value) return 0;
  return poll.value.options.reduce((sum, opt) => sum + opt.votes_count, 0);
});

function normalizePercentages() {
  if (!poll.value) return;
  poll.value.options.forEach((option) => {
    option.percentage = totalVotes.value > 0 ? Math.round((option.votes_count / totalVotes.value) * 100) : 0;
  });
}

async function vote(optionId: number) {
  if (!poll.value || voted.value || submitting.value) return;

  submitting.value = true;
  message.value = '';

  try {
    const res = await pollAPI.vote(poll.value.id, optionId);
    const updatedPoll = apiData<Poll | null>(res, null);
    if (updatedPoll) poll.value = updatedPoll;
    selectedOption.value = optionId;
    voted.value = true;
    messageType.value = 'success';
    message.value = (res as { message?: string }).message || 'تم تسجيل تصويتك';
    normalizePercentages();
  } catch (e) {
    messageType.value = 'error';
    message.value = errorMessage(e, 'تعذر تسجيل التصويت');
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try {
    const res = await pollAPI.getActive();
    poll.value = apiArray<Poll>(res)[0] || fallbackPolls[0] || null;
    normalizePercentages();
  } catch (e) {
    poll.value = fallbackPolls[0] || null;
    normalizePercentages();
  }
});
</script>
