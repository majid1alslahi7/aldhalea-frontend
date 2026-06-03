import { defineStore } from 'pinia';
import { ref } from 'vue';
import { categoryAPI } from '@/api/news';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<any[]>([]);
  const menuCategories = ref<any[]>([]);

  async function fetchCategories() { const res: any = await categoryAPI.getAll(); categories.value = res.data; }
  async function fetchMenuCategories() { const res: any = await categoryAPI.getMenu(); menuCategories.value = res.data; }

  return { categories, menuCategories, fetchCategories, fetchMenuCategories };
});
