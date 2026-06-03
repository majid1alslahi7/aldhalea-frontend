<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 :size="40" class="animate-spin text-primary-600" />
      </div>

      <article v-else-if="item" class="card p-5 md:p-8">
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <span class="inline-block rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">{{ contentLabel }}</span>
          <span v-if="item.category" class="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            {{ localizedText(item.category.name) }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{{ localizedText(item.title) }}</h1>
        <p v-if="localizedText(item.subtitle || item.excerpt)" class="mb-6 text-lg leading-8 text-gray-600">
          {{ localizedText(item.subtitle || item.excerpt) }}
        </p>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
          <span v-if="authorName" class="flex items-center gap-1"><User :size="16" /> {{ authorName }}</span>
          <span v-if="item.published_at" class="flex items-center gap-1"><Calendar :size="16" /> {{ formatDate(item.published_at) }}</span>
          <span v-if="item.reading_time" class="flex items-center gap-1"><Clock :size="16" /> {{ item.reading_time }} دقيقة</span>
          <span class="flex items-center gap-1"><Eye :size="16" /> {{ item.views_count || 0 }}</span>
        </div>

        <img v-if="imageUrl" :src="imageUrl" :alt="localizedText(item.title)" class="mb-8 w-full rounded-lg shadow-lg" />
        <div class="prose prose-lg max-w-none article-content" v-html="safeContent"></div>

        <div v-if="item.source_name" class="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <span class="font-bold text-gray-800">مصدر المعلومات: </span>
          <a v-if="item.source_url" :href="item.source_url" target="_blank" rel="noopener noreferrer" class="text-primary-700 hover:underline">
            {{ item.source_name }}
          </a>
          <span v-else>{{ item.source_name }}</span>
        </div>
      </article>

      <div v-else class="card p-8 text-center text-gray-500">
        المحتوى غير متاح حالياً
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Calendar, Clock, Eye, Loader2, User } from '@lucide/vue';
import { interviewAPI, investigationAPI, reportAPI } from '@/api/news';
import type { EditorialContentItem } from '@/types/api';
import { apiData, localizedText, sanitizeHtml, slugValue } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { assetUrl, routeUrl, site } from '@/utils/site';

type ContentType = 'report' | 'investigation' | 'interview';

const route = useRoute();
const item = ref<EditorialContentItem | null>(null);
const loading = ref(true);

const config = computed(() => {
  const type = (route.meta.contentType as ContentType) || 'report';
  if (type === 'investigation') return { type, label: 'تحقيق', path: 'investigations', api: investigationAPI };
  if (type === 'interview') return { type, label: 'مقابلة', path: 'interviews', api: interviewAPI };
  return { type, label: 'تقرير', path: 'reports', api: reportAPI };
});

const contentLabel = computed(() => config.value.label);
const safeContent = computed(() => sanitizeHtml(item.value?.content));
const imageUrl = computed(() => item.value?.main_image || item.value?.thumbnail || item.value?.featured_image || '');
const authorName = computed(() => item.value?.user?.name || item.value?.writer?.name || item.value?.interviewer?.name || item.value?.interviewee_name || '');

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateSeo(slug: string) {
  if (!item.value) {
    applySeo({
      title: `${contentLabel.value} غير متاح`,
      description: site.description,
      path: `/${config.value.path}/${slug}`,
      noindex: true,
    });
    return;
  }

  const title = localizedText(item.value.title);
  const description = localizedText(item.value.excerpt || item.value.subtitle) || site.description;
  const path = `/${config.value.path}/${slugValue(item.value.slug) || slug}`;
  const image = imageUrl.value ? assetUrl(imageUrl.value) : assetUrl(site.defaultImage);

  applySeo({
    title,
    description,
    path,
    image,
    type: 'article',
    publishedTime: item.value.published_at,
    modifiedTime: item.value.updated_at,
    author: authorName.value,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': config.value.type === 'interview' ? 'Article' : 'NewsArticle',
      headline: title,
      description,
      image,
      datePublished: item.value.published_at,
      dateModified: item.value.updated_at || item.value.published_at,
      author: { '@type': 'Person', name: authorName.value || site.name },
      publisher: { '@type': 'NewsMediaOrganization', name: site.name, logo: { '@type': 'ImageObject', url: assetUrl('/icons/pwa-512.png') } },
      mainEntityOfPage: routeUrl(path),
      inLanguage: site.language,
    },
  });
}

async function loadContent(slug: string) {
  const activeRouteName = route.name;
  const activeSlug = slug;
  loading.value = true;
  item.value = null;
  try {
    const res = await config.value.api.getBySlug(slug);
    if (route.name !== activeRouteName || route.params.slug !== activeSlug) return;
    item.value = apiData<EditorialContentItem | null>(res, null);
  } catch {
    if (route.name !== activeRouteName || route.params.slug !== activeSlug) return;
    item.value = null;
  } finally {
    if (route.name !== activeRouteName || route.params.slug !== activeSlug) return;
    loading.value = false;
    updateSeo(slug);
  }
}

watch(
  () => [route.name, route.params.slug],
  () => loadContent(route.params.slug as string),
  { immediate: true },
);
</script>
