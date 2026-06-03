<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 rounded-lg border border-gray-100 bg-white p-6">
        <div class="mb-4 h-2 w-20 rounded-full" :style="{ background: tag?.color || '#154da5' }"></div>
        <p class="text-sm font-bold text-red-600">وسم</p>
        <h1 class="mt-2 text-3xl font-extrabold text-primary-950">{{ localizedText(tag?.name) || 'وسم' }}</h1>
        <p class="mt-3 max-w-3xl leading-8 text-gray-500">{{ localizedText(tag?.description) || 'مواد مرتبطة بهذا الموضوع في الضالع أونلاين.' }}</p>
      </header>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <div v-if="loading && !items.length" class="card p-8 text-center text-gray-500">جار تحميل المواد...</div>
          <div v-else-if="items.length" class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ContentCard
              v-for="item in items"
              :key="item.key"
              :title="item.title"
              :excerpt="item.excerpt"
              :image-url="item.image"
              :to="item.to"
              :label="item.label"
              :category="item.category"
              :author="item.author"
              :date-text="item.dateText"
              :views="item.views"
            />
          </div>
          <div v-else class="card p-8 text-center text-gray-500">لا توجد مواد منشورة لهذا الوسم حالياً.</div>
        </main>

        <aside class="card p-5">
          <h2 class="mb-4 text-lg font-extrabold">وسوم رائجة</h2>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="item in relatedTags" :key="item.id" :to="`/tags/${slugValue(item.slug)}`" class="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-600 transition hover:bg-primary-50 hover:text-primary-700">
              {{ localizedText(item.name) }}
            </router-link>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ContentCard from '@/components/content/ContentCard.vue';
import { tagAPI } from '@/api/news';
import type { ArticleItem, NewsItem, TagItem } from '@/types/api';
import { apiArray, apiData, localizedText, slugValue } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { fallbackArticles, fallbackNews, fallbackTags, tagBySlug } from '@/data/curatedContent';

const route = useRoute();
const tag = ref<TagItem | null>(null);
const items = ref<Array<{ key: string; title: string; excerpt: string; image?: string | null; to: string; label: string; category?: string; author?: string; dateText?: string | null; views?: number }>>([]);
const loading = ref(false);

const relatedTags = computed(() => fallbackTags.filter((item) => item.id !== tag.value?.id).slice(0, 8));

function makeNewsCard(item: NewsItem) {
  return {
    key: `news-${item.id}`,
    title: localizedText(item.title),
    excerpt: localizedText(item.excerpt || item.subtitle),
    image: item.thumbnail || item.main_image,
    to: `/news/${slugValue(item.slug)}`,
    label: 'خبر',
    category: localizedText(item.category?.name),
    author: item.writer?.name || 'الضالع أونلاين',
    dateText: item.published_diff || item.published_date,
    views: item.stats?.views,
  };
}

function makeArticleCard(item: ArticleItem) {
  return {
    key: `article-${item.id}`,
    title: localizedText(item.title),
    excerpt: localizedText(item.excerpt),
    image: item.featured_image,
    to: `/articles/${slugValue(item.slug)}`,
    label: 'مقال',
    category: localizedText(item.category?.name),
    author: item.writer?.name || 'الضالع أونلاين',
    dateText: item.published_diff || item.published_at,
    views: item.stats?.views,
  };
}

function fallbackItems(slug: string) {
  const tagName = localizedText(tag.value?.name);
  const source = `${tagName} ${decodeURIComponent(slug)}`.trim();
  const news = fallbackNews.filter((item) => `${localizedText(item.title)} ${localizedText(item.excerpt)} ${localizedText(item.content)} ${localizedText(item.category?.name)}`.includes(tagName) || `${localizedText(item.title)} ${localizedText(item.excerpt)}`.includes(source));
  const articles = fallbackArticles.filter((item) => `${localizedText(item.title)} ${localizedText(item.excerpt)} ${localizedText(item.content)} ${localizedText(item.category?.name)}`.includes(tagName));
  return [...news.map(makeNewsCard), ...articles.map(makeArticleCard)];
}

async function loadTag() {
  const slug = route.params.slug as string;
  loading.value = true;
  tag.value = tagBySlug(slug);
  items.value = fallbackItems(slug);

  try {
    const [tagRes, newsRes, articlesRes] = await Promise.all([
      tagAPI.getBySlug(slug),
      tagAPI.getNews(slug),
      tagAPI.getArticles(slug),
    ]);
    tag.value = tag.value || apiData<TagItem | null>(tagRes, null);
    const apiCards = [...apiArray<NewsItem>(newsRes).map(makeNewsCard), ...apiArray<ArticleItem>(articlesRes).map(makeArticleCard)];
    if (apiCards.length) {
      const seen = new Set(items.value.map((item) => item.title));
      items.value = [...items.value, ...apiCards.filter((item) => !seen.has(item.title))];
    }
  } catch {
    // fallback already rendered
  } finally {
    loading.value = false;
    const title = localizedText(tag.value?.name) || 'وسم';
    applySeo({ title: `وسم ${title}`, description: localizedText(tag.value?.description) || `مواد مرتبطة بوسم ${title} في الضالع أونلاين.`, path: route.fullPath });
  }
}

watch(() => route.params.slug, loadTag, { immediate: true });
</script>
