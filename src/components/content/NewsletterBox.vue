<template>
  <section class="newsletter-band">
    <div>
      <p class="text-sm font-bold text-red-600">النشرة البريدية</p>
      <h2 class="mt-1 text-2xl font-extrabold">ملخص الضالع أونلاين في بريدك</h2>
      <p class="mt-2 max-w-2xl text-sm leading-7 text-gray-500">اشترك لتصلك أهم الأخبار والتقارير والتحقيقات المختارة بدون إزعاج.</p>
    </div>

    <form class="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" @submit.prevent="submit">
      <input v-model="name" class="newsletter-input" type="text" placeholder="الاسم" autocomplete="name" />
      <input v-model="email" class="newsletter-input" type="email" placeholder="البريد الإلكتروني" autocomplete="email" required />
      <button class="btn-primary justify-center" type="submit" :disabled="loading">{{ loading ? 'جار الإرسال...' : 'اشتراك' }}</button>
    </form>
    <p v-if="message" class="mt-3 text-sm" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'">{{ message }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { newsletterAPI } from '@/api/news';
import { errorMessage } from '@/utils/content';

const name = ref('');
const email = ref('');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

async function submit() {
  loading.value = true;
  message.value = '';
  try {
    const res = await newsletterAPI.subscribe({ name: name.value || undefined, email: email.value });
    messageType.value = 'success';
    message.value = (res as { message?: string }).message || 'تم الاشتراك بنجاح';
    email.value = '';
    name.value = '';
  } catch (e) {
    messageType.value = 'error';
    message.value = errorMessage(e, 'تعذر الاشتراك الآن');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.newsletter-band {
  background: linear-gradient(135deg, color-mix(in srgb, var(--surface) 92%, var(--brand-blue)), var(--surface));
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
}
.newsletter-input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  outline: none;
  padding: .85rem 1rem;
}
.newsletter-input:focus { border-color: var(--brand-blue); }
</style>
