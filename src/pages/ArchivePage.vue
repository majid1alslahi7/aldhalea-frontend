<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container-custom py-8">
      <header class="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-bold text-red-600">{{ config.eyebrow }}</p>
          <h1 class="mt-2 text-3xl font-extrabold text-primary-950">{{ config.title }}</h1>
          <p class="mt-3 max-w-3xl leading-8 text-gray-500">{{ config.description }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <router-link v-for="link in quickLinks" :key="link.to" :to="link.to" class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:border-primary-300 hover:text-primary-700">
            {{ link.label }}
          </router-link>
        </div>
        <form v-if="config.type === 'archive'" class="flex gap-2" @submit.prevent="goToDate">
          <input v-model="dateFilter" class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-400" type="date" />
          <button class="btn-primary px-4 py-2 text-sm" type="submit">عرض اليوم</button>
        </form>
      </header>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <main>
          <div v-if="loading && !cards.length" class="card p-8 text-center text-gray-500">جار تحميل المحتوى...</div>
          <div v-else-if="cards.length" class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ContentCard
              v-for="item in cards"
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
          <div v-else class="card p-8 text-center text-gray-500">لا يوجد محتوى منشور في هذا القسم حالياً.</div>

          <div v-if="canLoadMore" class="mt-8 text-center">
            <button class="btn-primary" :disabled="loading" @click="loadMore">{{ loading ? 'جار التحميل...' : 'تحميل المزيد' }}</button>
          </div>
        </main>

        <aside class="space-y-6">
          <section class="card p-5">
            <h2 class="mb-4 text-lg font-extrabold">أقسام التحرير</h2>
            <div class="grid grid-cols-2 gap-2">
              <router-link v-for="link in archiveLinks" :key="link.to" :to="link.to" class="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-700">
                {{ link.label }}
              </router-link>
            </div>
          </section>

          <NewsletterBox />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContentCard from '@/components/content/ContentCard.vue';
import NewsletterBox from '@/components/content/NewsletterBox.vue';
import { articleAPI, interviewAPI, investigationAPI, newsAPI, reportAPI } from '@/api/news';
import type { ArticleItem, EditorialContentItem, NewsItem } from '@/types/api';
import { apiArray, localizedText, slugValue } from '@/utils/content';
import { applySeo } from '@/utils/seo';
import { fallbackArticles, fallbackNews, textValue } from '@/data/curatedContent';

type ArchiveType = 'news' | 'articles' | 'reports' | 'investigations' | 'interviews' | 'popular' | 'editors' | 'breaking' | 'archive';

interface CardItem {
  key: string;
  title: string;
  excerpt: string;
  image?: string | null;
  to: string;
  label: string;
  category?: string;
  author?: string;
  dateText?: string | null;
  views?: number;
}

const route = useRoute();
const router = useRouter();
const cards = ref<CardItem[]>([]);
const loading = ref(false);
const page = ref(1);
const canLoadMore = ref(false);
const dateFilter = ref('');

const archiveLinks = [
  { label: 'كل الأخبار', to: '/news' },
  { label: 'المقالات', to: '/articles' },
  { label: 'التقارير', to: '/reports' },
  { label: 'التحقيقات', to: '/investigations' },
  { label: 'المقابلات', to: '/interviews' },
  { label: 'الأكثر قراءة', to: '/popular' },
  { label: 'اختيارات المحرر', to: '/editors-picks' },
  { label: 'الأرشيف', to: '/archive' },
];

const quickLinks = [
  { label: 'الوسوم', to: '/tags' },
  { label: 'الكتّاب', to: '/writers' },
  { label: 'استطلاعات الرأي', to: '/polls' },
  { label: 'النشرة البريدية', to: '/newsletter' },
];

const config = computed(() => {
  const type = (route.meta.archiveType as ArchiveType) || 'news';
  const map: Record<ArchiveType, { title: string; eyebrow: string; description: string }> = {
    news: { title: 'كل الأخبار', eyebrow: 'غرفة الأخبار', description: 'أرشيف الأخبار المنشورة في الضالع أونلاين مرتبة من الأحدث إلى الأقدم.' },
    articles: { title: 'المقالات والتحليلات', eyebrow: 'رأي وتحليل', description: 'كتابات تحليلية ومقالات رأي تشرح خلفيات الأحداث وأثرها على الناس.' },
    reports: { title: 'التقارير', eyebrow: 'تغطيات معمقة', description: 'تقارير موسعة وميدانية ومرئية حول الخدمات والمجتمع والاقتصاد.' },
    investigations: { title: 'التحقيقات', eyebrow: 'ملفات معمقة', description: 'تحقيقات وقراءات بيانات تبحث في أسباب المشكلات لا عناوينها فقط.' },
    interviews: { title: 'المقابلات', eyebrow: 'حوارات', description: 'حوارات مع كتّاب وخبراء وشخصيات محلية حول الشأن العام.' },
    popular: { title: 'الأكثر قراءة', eyebrow: 'اهتمام القراء', description: 'المحتوى الذي حظي بأعلى متابعة وقراءة خلال الفترة الأخيرة.' },
    editors: { title: 'اختيارات المحرر', eyebrow: 'مختارات', description: 'مواد يرشحها فريق التحرير لأهميتها وسياقها وتأثيرها.' },
    breaking: { title: 'الأخبار العاجلة', eyebrow: 'عاجل', description: 'آخر الأخبار العاجلة والمواد التي تحتاج متابعة سريعة.' },
    archive: { title: 'الأرشيف الزمني', eyebrow: 'أرشيف', description: 'مدخل منظم للوصول إلى الأخبار والمقالات والتقارير المنشورة سابقاً.' },
  };
  return { type, ...map[type] };
});

function newsCard(item: NewsItem, label = 'خبر'): CardItem {
  return {
    key: `news-${item.id}`,
    title: localizedText(item.title),
    excerpt: localizedText(item.excerpt || item.subtitle),
    image: item.thumbnail || item.main_image,
    to: `/news/${slugValue(item.slug)}`,
    label,
    category: localizedText(item.category?.name),
    author: item.writer?.name || 'الضالع أونلاين',
    dateText: item.published_diff || item.published_date,
    views: item.stats?.views,
  };
}

function articleCard(item: ArticleItem): CardItem {
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

function editorialCard(item: EditorialContentItem, path: string, label: string): CardItem {
  return {
    key: `${path}-${item.id}`,
    title: localizedText(item.title),
    excerpt: localizedText(item.excerpt || item.subtitle),
    image: item.thumbnail || item.main_image || item.featured_image,
    to: `/${path}/${slugValue(item.slug)}`,
    label,
    category: localizedText(item.category?.name),
    author: item.user?.name || item.writer?.name || item.interviewer?.name || item.interviewee_name || 'الضالع أونلاين',
    dateText: item.published_at,
    views: item.views_count,
  };
}

function fallbackCards(type: ArchiveType): CardItem[] {
  if (type === 'articles') return fallbackArticles.map(articleCard);
  if (type === 'reports') return fallbackNews.filter((item) => textValue(item.category?.slug) === 'تقارير-مصورة').map((item) => newsCard(item, 'تقرير مصور'));
  if (type === 'investigations') return fallbackNews.filter((item) => textValue(item.category?.slug) === 'تحقيقات').map((item) => newsCard(item, 'تحقيق'));
  if (type === 'interviews') return fallbackArticles.slice(0, 3).map((item) => ({ ...articleCard(item), label: 'حوار تحليلي' }));
  if (type === 'popular') return fallbackNews.slice().sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0)).slice(0, 12).map((item) => newsCard(item, 'الأكثر قراءة'));
  if (type === 'editors') return fallbackNews.filter((item) => item.priority === 'editors_pick' || item.priority === 'featured').map((item) => newsCard(item, 'اختيار المحرر'));
  if (type === 'breaking') return fallbackNews.filter((item) => item.priority === 'breaking').map((item) => newsCard(item, 'عاجل'));
  return fallbackNews.map((item) => newsCard(item));
}

async function fetchCards(type: ArchiveType, targetPage = 1): Promise<CardItem[]> {
  if (type === 'articles') return apiArray<ArticleItem>(await articleAPI.getAll({ page: targetPage })).map(articleCard);
  if (type === 'reports') return apiArray<EditorialContentItem>(await reportAPI.getAll({ page: targetPage })).map((item) => editorialCard(item, 'reports', 'تقرير'));
  if (type === 'investigations') return apiArray<EditorialContentItem>(await investigationAPI.getAll({ page: targetPage })).map((item) => editorialCard(item, 'investigations', 'تحقيق'));
  if (type === 'interviews') return apiArray<EditorialContentItem>(await interviewAPI.getAll({ page: targetPage })).map((item) => editorialCard(item, 'interviews', 'مقابلة'));
  if (type === 'popular') return apiArray<NewsItem>(await newsAPI.getPopular()).map((item) => newsCard(item, 'الأكثر قراءة'));
  if (type === 'editors') return apiArray<NewsItem>(await newsAPI.getEditorsPicks()).map((item) => newsCard(item, 'اختيار المحرر'));
  if (type === 'breaking') return apiArray<NewsItem>(await newsAPI.getBreaking()).map((item) => newsCard(item, 'عاجل'));
  if (type === 'archive' && dateFilter.value) return apiArray<NewsItem>(await newsAPI.getByDate(dateFilter.value, targetPage)).map((item) => newsCard(item, 'أرشيف'));
  return apiArray<NewsItem>(await newsAPI.getAll({ page: targetPage, per_page: 15 })).map((item) => newsCard(item));
}

async function load(reset = true) {
  const type = config.value.type;
  if (reset) {
    page.value = 1;
    dateFilter.value = (route.query.date as string) || '';
    cards.value = fallbackCards(type);
  }
  loading.value = true;
  applySeo({ title: config.value.title, description: config.value.description, path: route.fullPath });

  try {
    const apiCards = await fetchCards(type, page.value);
    if (apiCards.length) {
      const fallbackKeys = new Set(cards.value.map((item) => item.title));
      const merged = reset ? [...cards.value, ...apiCards.filter((item) => !fallbackKeys.has(item.title))] : [...cards.value, ...apiCards];
      cards.value = merged;
      canLoadMore.value = ['news', 'articles', 'reports', 'investigations', 'interviews'].includes(type);
    }
  } catch {
    canLoadMore.value = false;
  } finally {
    loading.value = false;
  }
}

async function loadMore() {
  page.value += 1;
  await load(false);
}

function goToDate() {
  if (!dateFilter.value) return;
  router.push({ path: '/archive', query: { date: dateFilter.value } });
}

watch(() => route.fullPath, () => load(true), { immediate: true });
</script>
