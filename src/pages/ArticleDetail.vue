<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 :size="40" class="animate-spin text-primary-600" />
      </div>

      <article v-else-if="article" class="card p-5 md:p-8">
        <span v-if="article.category" class="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full mb-4">
          {{ localizedText(article.category.name) }}
        </span>
        <h1 class="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{{ localizedText(article.title) }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
          <span v-if="article.writer" class="flex items-center gap-1"><User :size="16" /> {{ article.writer.name }}</span>
          <span v-if="article.published_diff" class="flex items-center gap-1"><Clock :size="16" /> {{ article.published_diff }}</span>
          <span class="flex items-center gap-1"><Eye :size="16" /> {{ article.stats?.views || 0 }}</span>
        </div>
        <img v-if="article.featured_image" :src="article.featured_image" class="w-full rounded-2xl mb-8 shadow-lg" />
        <div class="prose prose-lg max-w-none article-content" v-html="safeContent"></div>
        <TagsList :tags="article.tags || []" />
        <ShareBar type="articles" :item-id="article.id" :title="localizedText(article.title)" :description="localizedText(article.excerpt)" :url="shareUrl" />
        <CorrectionReportBox type="articles" :item-id="article.id" :title="localizedText(article.title)" :url="shareUrl" />
        <RelatedContent title="مقالات مرتبطة" :items="relatedArticles" base-path="/articles" archive-path="/articles" />
        <CommentsBlock type="articles" :item-id="article.id" />
      </article>

      <div v-else class="card p-8 text-center text-gray-500">
        المقال غير متاح حالياً
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Clock, Eye, Loader2, User } from '@lucide/vue';
import { articleAPI } from '@/api/news';
import CommentsBlock from '@/components/content/CommentsBlock.vue';
import CorrectionReportBox from '@/components/content/CorrectionReportBox.vue';
import RelatedContent from '@/components/content/RelatedContent.vue';
import ShareBar from '@/components/content/ShareBar.vue';
import TagsList from '@/components/content/TagsList.vue';
import type { ArticleItem } from '@/types/api';
import { apiArray, apiData, localizedText, sanitizeHtml, slugValue } from '@/utils/content';
import { articleBySlug, fallbackArticles, textValue } from '@/data/curatedContent';
import { applySeo } from '@/utils/seo';
import { assetUrl, routeUrl, site } from '@/utils/site';

const route = useRoute();
const article = ref<ArticleItem | null>(null);
const relatedArticles = ref<ArticleItem[]>([]);
const loading = ref(true);

const safeContent = computed(() => sanitizeHtml(article.value?.content));
const shareUrl = computed(() => article.value ? routeUrl(`/articles/${slugValue(article.value.slug)}`) : routeUrl(route.fullPath));

function fallbackRelated(current: ArticleItem | null) {
  if (!current) return [];
  const currentCategory = textValue(current.category?.slug);
  const sameCategory = fallbackArticles
    .filter((item) => item.id !== current.id && textValue(item.category?.slug) === currentCategory)
    .slice(0, 4);

  if (sameCategory.length) return sameCategory;

  return fallbackArticles
    .filter((item) => item.id !== current.id)
    .slice(0, 4);
}

function updateSeo(slug: string) {
  if (!article.value) {
    applySeo({ title: 'المقال غير متاح', description: site.description, path: `/articles/${slug}`, noindex: true });
    return;
  }

  const title = localizedText(article.value.title);
  const description = localizedText(article.value.excerpt) || site.description;
  const path = `/articles/${slugValue(article.value.slug) || slug}`;
  const image = article.value.featured_image || site.defaultImage;

  applySeo({
    title,
    description,
    path,
    image,
    type: 'article',
    author: article.value.writer?.name || site.name,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image: assetUrl(image),
      author: { '@type': 'Person', name: article.value.writer?.name || site.name },
      publisher: { '@type': 'NewsMediaOrganization', name: site.name, logo: { '@type': 'ImageObject', url: assetUrl('/icons/pwa-512.png') } },
      mainEntityOfPage: routeUrl(path),
      articleSection: localizedText(article.value.category?.name),
      keywords: (article.value.tags || []).map((tag) => localizedText(tag.name)).filter(Boolean).join(', '),
      inLanguage: site.language,
    },
  });
}

async function loadArticle(slug: string) {
  const activeSlug = slug;
  loading.value = true;
  article.value = null;
  relatedArticles.value = [];
  const fallbackArticle = articleBySlug(slug);

  if (fallbackArticle) {
    article.value = fallbackArticle;
    relatedArticles.value = fallbackRelated(fallbackArticle);
    loading.value = false;
    updateSeo(slug);
  }

  try {
    const res = await articleAPI.getBySlug(slug);
    if (route.params.slug !== activeSlug) return;
    article.value = fallbackArticle || apiData<ArticleItem | null>(res, null);
    relatedArticles.value = fallbackRelated(article.value);
    if (article.value && article.value.id > 0) {
      try {
        const related = await articleAPI.getRelated(article.value.id);
        if (route.params.slug === activeSlug) {
          const relatedItems = apiArray<ArticleItem>(related).slice(0, 4);
          relatedArticles.value = relatedItems.length ? relatedItems : fallbackRelated(article.value);
        }
      } catch {
        relatedArticles.value = fallbackRelated(article.value);
      }
    }
  } catch {
    if (route.params.slug !== activeSlug) return;
    article.value = fallbackArticle;
    relatedArticles.value = fallbackRelated(article.value);
  } finally {
    if (route.params.slug !== activeSlug) return;
    loading.value = false;
    updateSeo(slug);
  }
}

watch(() => route.params.slug, (slug) => loadArticle(slug as string), { immediate: true });
</script>
