import { createRouter, createWebHistory } from 'vue-router';
import { applySeo } from '@/utils/seo';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue'), meta: { title: 'الضالع أونلاين - الرئيسية', description: 'آخر أخبار الضالع واليمن وتقارير وتحقيقات ومقالات موسعة من الضالع أونلاين.' } },
    { path: '/news/:slug', name: 'news-detail', component: () => import('@/pages/NewsDetail.vue'), meta: { title: 'تفاصيل الخبر' } },
    { path: '/category/:slug', name: 'category', component: () => import('@/pages/CategoryPage.vue'), meta: { title: 'تصنيف' } },
    { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue'), meta: { title: 'بحث', description: 'ابحث في أخبار ومقالات وتقارير الضالع أونلاين.' } },
    { path: '/articles/:slug', name: 'article-detail', component: () => import('@/pages/ArticleDetail.vue'), meta: { title: 'مقال' } },
    { path: '/reports/:slug', name: 'report-detail', component: () => import('@/pages/ContentDetail.vue'), meta: { title: 'تقرير', contentType: 'report' } },
    { path: '/investigations/:slug', name: 'investigation-detail', component: () => import('@/pages/ContentDetail.vue'), meta: { title: 'تحقيق', contentType: 'investigation' } },
    { path: '/interviews/:slug', name: 'interview-detail', component: () => import('@/pages/ContentDetail.vue'), meta: { title: 'مقابلة', contentType: 'interview' } },
    { path: '/about', name: 'about', component: () => import('@/pages/AboutPage.vue'), meta: { title: 'من نحن - الضالع أونلاين', description: 'تعرف على رسالة الضالع أونلاين ومنهجها التحريري في تغطية الأخبار والتقارير.' } },
    { path: '/contact', name: 'contact', component: () => import('@/pages/ContactPage.vue'), meta: { title: 'اتصل بنا - الضالع أونلاين', description: 'تواصل مع فريق الضالع أونلاين لإرسال الأخبار والملاحظات والمقترحات.' } },
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
