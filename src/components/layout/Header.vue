<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div class="bg-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between py-1.5 text-xs">
        <span class="hidden sm:block">{{ currentDate }}</span>
        <div class="flex items-center gap-2 ml-auto sm:ml-0">
          <a v-for="s in socials" :key="s.name" :href="s.url" class="hover:text-primary-300 transition p-1" v-html="s.svg"></a>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between py-3 md:py-4">
        <router-link to="/" class="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-primary-600/30">ض</div>
          <div class="text-right">
            <h1 class="text-lg md:text-2xl font-extrabold text-primary-900 leading-tight">الضالع أونلاين</h1>
            <p class="text-[10px] md:text-xs text-gray-500">أينما كنتَ.. نُحيطكَ بالخبر</p>
          </div>
        </router-link>

        <div class="flex items-center gap-2 md:gap-3">
          <div class="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
            <Search :size="18" class="text-gray-400" />
            <input v-model="searchQuery" @keyup.enter="goToSearch" type="text" placeholder="ابحث عن خبر..." class="bg-transparent border-none outline-none text-sm w-40 xl:w-56" />
          </div>
          <button @click="showMobileSearch = !showMobileSearch" class="lg:hidden p-2 hover:bg-gray-100 rounded-xl"><Search :size="20" /></button>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu v-if="!mobileMenuOpen" :size="24" /><X v-else :size="24" />
          </button>
        </div>
      </div>
      <div v-if="showMobileSearch" class="lg:hidden pb-3">
        <div class="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
          <Search :size="18" class="text-gray-400" />
          <input v-model="searchQuery" @keyup.enter="goToSearch" type="text" placeholder="ابحث عن خبر..." class="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>
    </div>

    <nav class="border-t border-gray-100 hidden lg:block">
      <div class="max-w-7xl mx-auto px-4">
        <ul class="flex items-center gap-1 overflow-x-auto">
          <li v-for="cat in menuItems" :key="cat.slug || cat.name">
            <router-link :to="cat.path || `/category/${cat.slug}`" class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all whitespace-nowrap">{{ cat.name }}</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <Transition name="slide">
      <nav v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white">
        <div class="max-w-7xl mx-auto px-4 py-3 space-y-1">
          <router-link v-for="cat in menuItems" :key="cat.slug || cat.name" :to="cat.path || `/category/${cat.slug}`" @click="mobileMenuOpen = false" class="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">{{ cat.name }}</router-link>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Menu, X } from '@lucide/vue';
import { useCategoryStore } from '@/stores/categories';

const router = useRouter();
const categoryStore = useCategoryStore();
const mobileMenuOpen = ref(false);
const showMobileSearch = ref(false);
const searchQuery = ref('');

const currentDate = computed(() => new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const socials = [
  { name: 'Facebook', url: '#', svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { name: 'Twitter', url: '#', svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
  { name: 'Youtube', url: '#', svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
];

const menuItems = computed(() => {
  const cats = categoryStore.menuCategories.map((c: any) => ({ name: c.name, slug: c.slug, path: `/category/${c.slug}` }));
  return [{ name: 'الرئيسية', slug: 'home', path: '/' }, ...cats, { name: 'من نحن', slug: 'about', path: '/about' }, { name: 'اتصل بنا', slug: 'contact', path: '/contact' }];
});

function goToSearch() {
  if (searchQuery.value.trim()) { router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`); searchQuery.value = ''; showMobileSearch.value = false; }
}

onMounted(() => categoryStore.fetchMenuCategories());
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
