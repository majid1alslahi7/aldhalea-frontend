<template>
  <section class="mt-8 rounded-lg border border-gray-200 bg-white p-4">
    <button type="button" class="flex w-full items-center justify-between gap-4 text-start" @click="open = !open">
      <span>
        <span class="block text-base font-extrabold text-gray-900">هل وجدت خطأ؟</span>
        <span class="mt-1 block text-sm leading-6 text-gray-500">أرسل تنبيها تحريريا مع رابط أو توضيح، وسيصل مباشرة لفريق المراجعة.</span>
      </span>
      <ChevronDown :size="20" class="shrink-0 text-gray-400 transition" :class="{ 'rotate-180': open }" />
    </button>

    <form v-if="open" class="mt-5 grid gap-4" @submit.prevent="submit">
      <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

      <label class="grid gap-2 text-sm font-bold text-gray-700">
        نوع البلاغ
        <select v-model="form.reason" class="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:border-primary-500">
          <option value="correction">تصحيح معلومة</option>
          <option value="source">مصدر أو إحالة</option>
          <option value="image">صورة أو وصف صورة</option>
          <option value="typo">خطأ لغوي أو مطبعي</option>
          <option value="rights">حقوق أو خصوصية</option>
          <option value="other">أخرى</option>
        </select>
      </label>

      <label class="grid gap-2 text-sm font-bold text-gray-700">
        تفاصيل البلاغ
        <textarea
          v-model.trim="form.details"
          rows="4"
          required
          minlength="20"
          maxlength="4000"
          class="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal leading-7 outline-none focus:border-primary-500"
          placeholder="اكتب الخطأ، التصحيح المقترح، وسبب الاعتماد على المعلومة الصحيحة"
        ></textarea>
      </label>

      <label class="grid gap-2 text-sm font-bold text-gray-700">
        رابط داعم اختياري
        <input v-model.trim="form.evidence_url" type="url" class="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:border-primary-500" placeholder="https://..." />
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-bold text-gray-700">
          الاسم اختياري
          <input v-model.trim="form.reporter_name" type="text" maxlength="120" class="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:border-primary-500" />
        </label>
        <label class="grid gap-2 text-sm font-bold text-gray-700">
          البريد اختياري
          <input v-model.trim="form.reporter_email" type="email" maxlength="255" class="rounded-lg border border-gray-200 bg-white px-3 py-2 font-normal outline-none focus:border-primary-500" />
        </label>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button type="submit" class="btn-primary gap-2 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-60" :disabled="submitting">
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          <Send v-else :size="16" />
          إرسال البلاغ
        </button>
        <span v-if="message" class="text-sm" :class="sent ? 'text-green-700' : 'text-red-600'">{{ message }}</span>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ChevronDown, Loader2, Send } from '@lucide/vue';
import { correctionAPI } from '@/api/news';
import { errorMessage } from '@/utils/content';

const props = defineProps<{
  type: string;
  itemId?: number;
  title: string;
  url: string;
}>();

const open = ref(false);
const submitting = ref(false);
const sent = ref(false);
const message = ref('');
const honeypot = ref('');

const form = reactive({
  reason: 'correction',
  details: '',
  evidence_url: '',
  reporter_name: '',
  reporter_email: '',
});

async function submit() {
  if (honeypot.value) return;

  submitting.value = true;
  sent.value = false;
  message.value = '';

  try {
    await correctionAPI.report({
      content_type: props.type,
      content_id: props.itemId,
      content_title: props.title,
      url: props.url,
      ...form,
    });
    sent.value = true;
    message.value = 'تم استلام البلاغ وسيتم مراجعته تحريريا.';
    form.details = '';
    form.evidence_url = '';
  } catch (error) {
    message.value = errorMessage(error, 'تعذر إرسال البلاغ الآن');
  } finally {
    submitting.value = false;
  }
}
</script>
