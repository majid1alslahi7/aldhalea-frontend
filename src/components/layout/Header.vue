<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <!-- الشريط العلوي -->
    <div class="bg-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between py-1.5 text-xs">
        <span class="hidden sm:block">{{ currentDate }}</span>
        <div class="flex items-center gap-2 ml-auto sm:ml-0">
          <a v-for="s in socials" :key="s.name" :href="s.url" class="hover:text-primary-300 transition p-1">
            <component :is="s.icon" :size="14" />
          </a>
        </div>
      </div>
    </div>

    <!-- الهيدر الرئيسي -->
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
          <!-- بحث سطح مكتب -->
          <div class="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
            <Search :size="18" class="text-gray-400" />
            <input v-model="searchQuery" @keyup.enter="goToSearch" type="text" placeholder="ابحث عن خبر..." class="bg-transparent border-none outline-none text-sm w-40 xl:w-56" />
          </div>
          
          <!-- أيقونة بحث للموبايل -->
          <button @click="showMobileSearch = !showMobileSearch" class="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Search :size="20" />
          </button>
          
          <!-- زر همبرغر -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu v-if="!mobileMenuOpen" :size="24" />
            <X v-else :size="24" />
          </button>
        </div>
      </div>
      
      <!-- شريط بحث الموبايل -->
      <div v-if="showMobileSearch" class="lg:hidden pb-3">
        <div class="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-2">
          <Search :size="18" class="text-gray-400" />
          <input v-model="searchQuery" @keyup.enter="goToSearch" type="text" placeholder="ابحث عن خبر..." class="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>
    </div>

    <!-- القائمة الرئيسية - سطح مكتب -->
    <nav class="border-t border-gray-100 hidden lg:block">
      <div class="max-w-7xl mx-auto px-4">
        <ul class="flex items-center gap-1 overflow-x-auto">
          <li v-for="cat in menuItems" :key="cat.slug || cat.name">
            <router-link :to="cat.path || `/category/${cat.slug}`" class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all whitespace-nowrap">
              {{ cat.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- القائمة المنسدلة للموبايل -->
    <Transition name="slide">
      <nav v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white">
        <div class="max-w-7xl mx-auto px-4 py-3 space-y-1">
          <router-link v-for="cat in menuItems" :key="cat.slug || cat.name" :to="cat.path || `/category/${cat.slug}`" @click="mobileMenuOpen = false" class="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
            {{ cat.name }}
          </router-link>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Menu, X, Facebook, Twitter, Youtube } from 'lucide-vue-next';
import { useCategoryStore } from '@/stores/categories';

const router = useRouter();
const categoryStore = useCategoryStore();
const mobileMenuOpen = ref(false);
const showMobileSearch = ref(false);
const searchQuery = ref('');

const currentDate = computed(() => new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

const socials = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'Youtube', icon: Youtube, url: '#' },
];

const menuItems = computed(() => {
  const cats = categoryStore.menuCategories.map((c: any) => ({
    name: c.name,
    slug: c.slug,
    path: `/category/${c.slug}`,
  }));
  return [
    { name: 'الرئيسية', slug: 'home', path: '/' },
    ...cats,
    { name: 'من نحن', slug: 'about', path: '/about' },
    { name: 'اتصل بنا', slug: 'contact', path: '/contact' },
  ];
});

function goToSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    searchQuery.value = '';
    showMobileSearch.value = false;
  }
}

onMounted(() => categoryStore.fetchMenuCategories());
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
