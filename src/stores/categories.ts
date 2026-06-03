import { defineStore } from 'pinia';
import { ref } from 'vue';
import { categoryAPI } from '@/api/news';
import type { Category } from '@/types/api';
import { apiArray } from '@/utils/content';
import { fallbackCategories, mergeCategoriesWithFallback } from '@/data/curatedContent';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const menuCategories = ref<Category[]>([]);

  async function fetchCategories() {
    try {
      const res = await categoryAPI.getAll();
      categories.value = mergeCategoriesWithFallback(apiArray<Category>(res));
    } catch {
      categories.value = fallbackCategories;
    }
  }

  async function fetchMenuCategories() {
    try {
      const res = await categoryAPI.getMenu();
      menuCategories.value = mergeCategoriesWithFallback(apiArray<Category>(res));
    } catch {
      menuCategories.value = fallbackCategories;
    }
  }

  return { categories, menuCategories, fetchCategories, fetchMenuCategories };
});
