import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue'), meta: { title: 'الضالع أونلاين - الرئيسية' } },
    { path: '/news/:slug', name: 'news-detail', component: () => import('@/pages/NewsDetail.vue'), meta: { title: 'تفاصيل الخبر' } },
    { path: '/category/:slug', name: 'category', component: () => import('@/pages/CategoryPage.vue'), meta: { title: 'تصنيف' } },
    { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue'), meta: { title: 'بحث' } },
    { path: '/articles/:slug', name: 'article-detail', component: () => import('@/pages/ArticleDetail.vue'), meta: { title: 'مقال' } },
    { path: '/about', name: 'about', component: () => import('@/pages/AboutPage.vue'), meta: { title: 'من نحن - الضالع أونلاين' } },
    { path: '/contact', name: 'contact', component: () => import('@/pages/ContactPage.vue'), meta: { title: 'اتصل بنا - الضالع أونلاين' } },
  ],
  scrollBehavior() { return { top: 0, behavior: 'smooth' }; }
});

router.beforeEach((to) => { document.title = (to.meta.title as string) || 'الضالع أونلاين'; });

export default router;
