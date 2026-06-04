<template>
  <section v-if="items.length" class="mt-10">
    <div class="mb-4 flex items-center justify-between gap-4">
      <h2 class="text-xl font-extrabold text-gray-900">{{ title }}</h2>
      <RouterLink v-if="archivePath" :to="archivePath" class="text-sm font-bold text-primary-700 hover:underline">المزيد</RouterLink>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <ContentCard
        v-for="item in normalizedItems"
        :key="`${basePath}-${item.id}`"
        :title="item.title"
        :excerpt="item.excerpt"
        :image-url="item.imageUrl"
        :to="item.to"
        :category="item.category"
        :author="item.author"
        :date-text="item.dateText"
        :views="item.views"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/content/ContentCard.vue';
import type { ArticleItem, EditorialContentItem, NewsItem } from '@/types/api';
import { localizedText, slugValue } from '@/utils/content';

const props = defineProps<{
  title?: string;
  items: Array<NewsItem | ArticleItem | EditorialContentItem>;
  basePath: string;
  archivePath?: string;
}>();

const title = computed(() => props.title || 'مواد مرتبطة');

const normalizedItems = computed(() => props.items.slice(0, 4).map((item) => {
  const slug = slugValue(item.slug);
  const isArticle = 'featured_image' in item && !('main_image' in item);
  const isNews = 'stats' in item;
  const imageUrl = ('main_image' in item && item.main_image) || ('thumbnail' in item && item.thumbnail) || ('featured_image' in item && item.featured_image) || null;
  const author = isNews
    ? (item as NewsItem).writer?.name
    : (item as ArticleItem).writer?.name || (item as EditorialContentItem).user?.name || (item as EditorialContentItem).interviewer?.name;

  return {
    id: item.id,
    title: localizedText(item.title),
    excerpt: localizedText(item.excerpt || ('subtitle' in item ? item.subtitle : '')),
    imageUrl,
    to: `${props.basePath}/${slug}`,
    category: localizedText(item.category?.name),
    author,
    dateText: (item as NewsItem).published_diff || (item as ArticleItem).published_diff || (item as EditorialContentItem).published_at || null,
    views: isNews || isArticle ? (item as NewsItem | ArticleItem).stats?.views : (item as EditorialContentItem).views_count,
  };
}));
</script>
