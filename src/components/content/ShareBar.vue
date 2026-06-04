<template>
  <section class="mt-8 rounded-lg border border-gray-200 bg-white p-4">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-base font-extrabold text-gray-900">شارك المادة</h2>
        <p class="mt-1 text-sm text-gray-500">انشر الرابط أو انسخه مع الحفاظ على رابط المصدر الأصلي.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button type="button" class="share-btn bg-primary-600 text-white" title="مشاركة" @click="nativeShare">
          <Share2 :size="18" />
        </button>
        <button type="button" class="share-btn bg-green-600 text-white" title="واتساب" @click="openPlatform('whatsapp')">
          <MessageCircle :size="18" />
        </button>
        <button type="button" class="share-btn bg-sky-600 text-white" title="تليجرام" @click="openPlatform('telegram')">
          <Send :size="18" />
        </button>
        <button type="button" class="share-btn bg-gray-900 text-white" title="منصة X" @click="openPlatform('x')">
          <AtSign :size="18" />
        </button>
        <button type="button" class="share-btn bg-red-600 text-white" title="بريد إلكتروني" @click="openPlatform('email')">
          <Mail :size="18" />
        </button>
        <button type="button" class="share-btn bg-gray-100 text-gray-700" title="نسخ الرابط" @click="copyLink">
          <Check v-if="copied" :size="18" />
          <Link2 v-else :size="18" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AtSign, Check, Link2, Mail, MessageCircle, Send, Share2 } from '@lucide/vue';
import { shareAPI } from '@/api/news';

type SharePlatform = 'whatsapp' | 'telegram' | 'x' | 'email' | 'copy_link' | 'native';

const props = defineProps<{
  type: string;
  itemId: number;
  title: string;
  description?: string;
  url: string;
}>();

const copied = ref(false);

const encodedUrl = () => encodeURIComponent(props.url);
const encodedTitle = () => encodeURIComponent(props.title);
const shareText = () => encodeURIComponent(`${props.title}\n${props.url}`);

async function track(platform: SharePlatform) {
  if (!props.itemId || props.itemId < 1) return;

  try {
    await shareAPI.track({
      shareable_type: props.type,
      shareable_id: props.itemId,
      platform,
      url: props.url,
    });
  } catch {
    // لا نكسر تجربة الزائر إذا تعذر تسجيل القياس.
  }
}

async function nativeShare() {
  if (navigator.share) {
    try {
      await navigator.share({ title: props.title, text: props.description || props.title, url: props.url });
      await track('native');
      return;
    } catch {
      return;
    }
  }

  await copyLink();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    window.setTimeout(() => { copied.value = false; }, 1800);
  } catch {
    window.prompt('انسخ الرابط', props.url);
  }

  await track('copy_link');
}

async function openPlatform(platform: Exclude<SharePlatform, 'copy_link' | 'native'>) {
  const targets = {
    whatsapp: `https://wa.me/?text=${shareText()}`,
    telegram: `https://t.me/share/url?url=${encodedUrl()}&text=${encodedTitle()}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl()}&text=${encodedTitle()}`,
    email: `mailto:?subject=${encodedTitle()}&body=${shareText()}`,
  };

  window.open(targets[platform], '_blank', 'noopener,noreferrer');
  await track(platform);
}
</script>

<style scoped>
.share-btn {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: .5rem;
  transition: transform .2s ease, box-shadow .2s ease;
}

.share-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgb(15 23 42 / 14%);
}
</style>
