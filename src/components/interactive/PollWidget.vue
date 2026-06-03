<template>
  <div v-if="poll" class="card p-5">
    <h3 class="font-bold text-lg mb-4">📊 استطلاع رأي</h3>
    <p class="font-medium text-sm mb-4">{{ typeof poll.question === 'object' ? poll.question.ar : poll.question }}</p>
    <div class="space-y-2">
      <button v-for="option in poll.options" :key="option.id" @click="vote(option.id)" :disabled="voted"
        class="w-full text-right p-3 rounded-xl border-2 transition-all relative overflow-hidden"
        :class="voted && selectedOption === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400'">
        <div class="flex justify-between items-center relative z-10">
          <span class="text-sm font-medium">{{ option.text }}</span>
          <span v-if="voted" class="text-sm font-bold text-primary-600">{{ option.percentage }}%</span>
        </div>
        <div v-if="voted" class="absolute inset-y-0 left-0 bg-primary-100 transition-all duration-500" :style="{ width: option.percentage + '%' }"></div>
      </button>
    </div>
    <p class="text-xs text-gray-400 mt-3 text-center">إجمالي المصوتين: {{ totalVotes }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { pollAPI } from '@/api/news';

const poll = ref<any>(null);
const voted = ref(false);
const selectedOption = ref<number | null>(null);

const totalVotes = computed(() => {
  if (!poll.value) return 0;
  return poll.value.options.reduce((sum: number, opt: any) => sum + opt.votes_count, 0);
});

function vote(optionId: number) {
  if (voted.value) return;
  selectedOption.value = optionId;
  voted.value = true;
  const option = poll.value.options.find((o: any) => o.id === optionId);
  if (option) {
    option.votes_count++;
    poll.value.options.forEach((o: any) => {
      o.percentage = Math.round((o.votes_count / totalVotes.value) * 100);
    });
  }
}

onMounted(async () => {
  try {
    const res: any = await pollAPI.getActive();
    if (res.data?.length) {
      poll.value = res.data[0];
      poll.value.options.forEach((o: any) => {
        o.percentage = totalVotes.value > 0 ? Math.round((o.votes_count / totalVotes.value) * 100) : 0;
      });
    }
  } catch (e) {}
});
</script>
