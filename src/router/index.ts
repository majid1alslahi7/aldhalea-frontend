import { createRouter, createWebHistory } from 'vue-router';
import { applySeo } from '@/utils/seo';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue'), meta: { title: 'الضالع أونلاين - الرئيسية', description: 'آخر أخبار الضالع واليمن وتقارير وتحقيقات ومقالات موسعة من الضالع أونلاين.' } },
    { path: '/news', name: 'news-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'كل الأخبار', archiveType: 'news' } },
    { path: '/articles', name: 'articles-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'المقالات', archiveType: 'articles' } },
    { path: '/reports', name: 'reports-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'التقارير', archiveType: 'reports' } },
    { path: '/investigations', name: 'investigations-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'التحقيقات', archiveType: 'investigations' } },
    { path: '/interviews', name: 'interviews-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'المقابلات', archiveType: 'interviews' } },
    { path: '/popular', name: 'popular-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'الأكثر قراءة', archiveType: 'popular' } },
    { path: '/editors-picks', name: 'editors-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'اختيارات المحرر', archiveType: 'editors' } },
    { path: '/breaking', name: 'breaking-archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'الأخبار العاجلة', archiveType: 'breaking' } },
    { path: '/archive', name: 'archive', component: () => import('@/pages/ArchivePage.vue'), meta: { title: 'الأرشيف', archiveType: 'archive' } },
    { path: '/news/:slug', name: 'news-detail', component: () => import('@/pages/NewsDetail.vue'), meta: { title: 'تفاصيل الخبر' } },
    { path: '/category/:slug', name: 'category', component: () => import('@/pages/CategoryPage.vue'), meta: { title: 'تصنيف' } },
    { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue'), meta: { title: 'بحث', description: 'ابحث في أخبار ومقالات وتقارير الضالع أونلاين.' } },
    { path: '/articles/:slug', name: 'article-detail', component: () => import('@/pages/ArticleDetail.vue'), meta: { title: 'مقال' } },
    { path: '/reports/:slug', name: 'report-detail', component: () => import('@/pages/ContentDetail.vue'), meta: { title: 'تقرير', contentType: 'report' } },
    { path: '/investigations/:slug', name: 'investigation-detail', component: () => import('@/pages/ContentDetail.vue'), meta: { title: 'تحقيق', contentType: 'investigation' } },
    { path: '/interviews/:slug', name: 'interview-detail', component: () => import('@/pages/ContentDetail.vue'), meta: { title: 'مقابلة', contentType: 'interview' } },
    { path: '/tags', name: 'tags', component: () => import('@/pages/TagsPage.vue'), meta: { title: 'الوسوم' } },
    { path: '/tags/:slug', name: 'tag-detail', component: () => import('@/pages/TagDetailPage.vue'), meta: { title: 'وسم' } },
    { path: '/writers', name: 'writers', component: () => import('@/pages/WritersPage.vue'), meta: { title: 'الكتّاب' } },
    { path: '/writers/:id', name: 'writer-detail', component: () => import('@/pages/WriterDetailPage.vue'), meta: { title: 'كاتب' } },
    { path: '/polls', name: 'polls', component: () => import('@/pages/PollsPage.vue'), meta: { title: 'استطلاعات الرأي' } },
    { path: '/polls/:id', name: 'poll-detail', component: () => import('@/pages/PollDetailPage.vue'), meta: { title: 'استطلاع رأي' } },
    { path: '/newsletter', name: 'newsletter', component: () => import('@/pages/NewsletterPage.vue'), meta: { title: 'النشرة البريدية' } },
    { path: '/about', name: 'about', component: () => import('@/pages/AboutPage.vue'), meta: { title: 'من نحن - الضالع أونلاين', description: 'تعرف على رسالة الضالع أونلاين ومنهجها التحريري في تغطية الأخبار والتقارير.' } },
    { path: '/contact', name: 'contact', component: () => import('@/pages/ContactPage.vue'), meta: { title: 'اتصل بنا - الضالع أونلاين', description: 'تواصل مع فريق الضالع أونلاين لإرسال الأخبار والملاحظات والمقترحات.' } },
    { path: '/privacy', name: 'privacy', component: () => import('@/pages/StaticInfoPage.vue'), meta: { title: 'سياسة الخصوصية', staticPage: 'privacy' } },
    { path: '/terms', name: 'terms', component: () => import('@/pages/StaticInfoPage.vue'), meta: { title: 'شروط الاستخدام', staticPage: 'terms' } },
    { path: '/editorial-policy', name: 'editorial-policy', component: () => import('@/pages/StaticInfoPage.vue'), meta: { title: 'سياسة النشر', staticPage: 'editorial' } },
    { path: '/corrections-policy', name: 'corrections-policy', component: () => import('@/pages/StaticInfoPage.vue'), meta: { title: 'سياسة التصحيح', staticPage: 'corrections' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue'), meta: { title: 'الصفحة غير موجودة', noindex: true } },
  ],
  scrollBehavior() { return { top: 0, behavior: 'smooth' }; }
});

router.beforeEach((to) => {
  applySeo({
    title: to.meta.title as string,
    description: to.meta.description as string,
    path: to.fullPath,
    noindex: Boolean(to.meta.noindex),
  });
});

export default router;
