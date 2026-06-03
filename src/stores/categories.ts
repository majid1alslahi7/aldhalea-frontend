import { defineStore } from 'pinia';
import { ref } from 'vue';
import { categoryAPI } from '@/api/news';
import type { Category } from '@/types/api';
import { apiArray } from '@/utils/content';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const menuCategories = ref<Category[]>([]);

  async function fetchCategories() {
    try {
      const res = await categoryAPI.getAll();
      categories.value = apiArray<Category>(res);
    } catch {
      categories.value = [];
    }
  }

  async function fetchMenuCategories() {
    try {
      const res = await categoryAPI.getMenu();
      menuCategories.value = apiArray<Category>(res);
    } catch {
      menuCategories.value = [];
    }
  }

  return { categories, menuCategories, fetchCategories, fetchMenuCategories };
});
