<template>
  <header class="site-header sticky top-0 z-50 backdrop-blur-md border-b shadow-sm">
    <div class="brand-strip text-white">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between py-1.5 text-xs">
        <span class="hidden sm:block">{{ currentDate }}</span>
        <div class="flex items-center gap-2 ml-auto sm:ml-0">
          <a v-for="s in socials" :key="s.name" :href="s.url" :aria-label="s.name" class="hover:text-primary-300 transition p-1">
            <component :is="s.icon" :size="14" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between py-3 md:py-4">
        <router-link to="/" class="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <img src="/brand/aldhalea-mark.png" alt="شعار الضالع أونلاين" class="h-12 w-12 md:h-14 md:w-14 object-contain" />
          <div class="text-right">
            <div class="text-lg md:text-2xl font-extrabold text-primary-900 leading-tight">الضالع أونلاين</div>
            <p class="text-[10px] md:text-xs text-gray-500">أينما كنتَ.. نُحيطكَ بالخبر</p>
          </div>
        </router-link>

        <div class="flex items-center gap-2 md:gap-3">
          <div class="hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2.5 gap-2">
            <Search :size="18" class="text-gray-400" />
            <input v-model="searchQuery" @keyup.enter="goToSearch" type="text" placeholder="ابحث عن خبر..." class="bg-transparent border-none outline-none text-sm w-40 xl:w-56" />
          </div>
          <button @click="toggleTheme" class="icon-button" :aria-label="isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'" :title="isDark ? 'الوضع النهاري' : 'الوضع الليلي'">
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>
          <button @click="showMobileSearch = !showMobileSearch" class="icon-button lg:hidden" aria-label="بحث"><Search :size="20" /></button>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="icon-button lg:hidden" aria-label="القائمة">
            <Menu v-if="!mobileMenuOpen" :size="24" /><X v-else :size="24" />
          </button>
        </div>
      </div>
      <div v-if="showMobileSearch" class="lg:hidden pb-3">
        <div class="flex items-center bg-gray-100 rounded-lg px-4 py-2.5 gap-2">
          <Search :size="18" class="text-gray-400" />
          <input v-model="searchQuery" @keyup.enter="goToSearch" type="text" placeholder="ابحث عن خبر..." class="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>
    </div>

    <nav class="border-t border-gray-100 hidden lg:block">
      <div class="max-w-7xl mx-auto px-4">
        <ul class="flex items-center gap-1 overflow-x-auto">
          <li v-for="cat in menuItems" :key="cat.slug || cat.name">
            <router-link :to="cat.path || `/category/${cat.slug}`" @click="closeOverlays" class="nav-link flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all whitespace-nowrap">{{ cat.name }}</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <Transition name="slide">
      <nav v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white">
        <div class="max-w-7xl mx-auto px-4 py-3 space-y-1">
          <router-link v-for="cat in menuItems" :key="cat.slug || cat.name" :to="cat.path || `/category/${cat.slug}`" @click="closeOverlays" class="nav-link block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">{{ cat.name }}</router-link>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CirclePlay, Globe, Menu, Moon, Search, Send, Sun, X } from '@lucide/vue';
import { useCategoryStore } from '@/stores/categories';
import { localizedText, slugValue } from '@/utils/content';
import { getThemePreference, toggleThemePreference } from '@/utils/theme';

const router = useRouter();
const categoryStore = useCategoryStore();
const mobileMenuOpen = ref(false);
const showMobileSearch = ref(false);
const searchQuery = ref('');
const isDark = ref(getThemePreference() === 'dark');

const currentDate = computed(() => new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const socials = [
  { name: 'Facebook', url: '#', icon: Globe },
  { name: 'Twitter', url: '#', icon: Send },
  { name: 'Youtube', url: '#', icon: CirclePlay },
];

const menuItems = computed(() => {
  const cats = categoryStore.menuCategories.map((c) => ({
    name: localizedText(c.name),
    slug: slugValue(c.slug),
    path: `/category/${slugValue(c.slug)}`,
  }));
  return [
    { name: 'الرئيسية', slug: 'home', path: '/' },
    { name: 'كل الأخبار', slug: 'news', path: '/news' },
    ...cats,
    { name: 'مقالات', slug: 'articles', path: '/articles' },
    { name: 'كتّاب', slug: 'writers', path: '/writers' },
    { name: 'استطلاعات', slug: 'polls', path: '/polls' },
    { name: 'من نحن', slug: 'about', path: '/about' },
    { name: 'اتصل بنا', slug: 'contact', path: '/contact' },
  ];
});

function goToSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    searchQuery.value = '';
    closeOverlays();
  }
}

function closeOverlays() {
  mobileMenuOpen.value = false;
  showMobileSearch.value = false;
}

function toggleTheme() {
  isDark.value = toggleThemePreference() === 'dark';
}

onMounted(() => categoryStore.fetchMenuCategories());
</script>

<style scoped>
.site-header {
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  border-color: var(--border);
}
.brand-strip { background: linear-gradient(90deg, #051836, #0b2b61 68%, #d71920); }
.icon-button {
  align-items: center;
  border-radius: 8px;
  color: var(--text-soft);
  display: inline-flex;
  height: 2.5rem;
  justify-content: center;
  transition: background-color .2s ease, color .2s ease;
  width: 2.5rem;
}
.icon-button:hover { background: var(--surface-muted); color: var(--brand-blue); }
.nav-link.router-link-active {
  background: color-mix(in srgb, var(--brand-blue) 12%, transparent);
  color: var(--brand-blue);
}
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
