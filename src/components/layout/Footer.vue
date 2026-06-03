<template>
  <footer class="footer-surface text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/brand/aldhalea-mark.png" alt="الضالع أونلاين" class="h-12 w-12 rounded-lg bg-white/95 object-contain p-1" />
            <div>
              <h3 class="text-xl font-bold">الضالع أونلاين</h3>
              <p class="text-xs text-gray-400">أينما كنت.. نحيطك بالخبر</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">منصة إخبارية شاملة تنقل مستجدات محافظة الضالع وتغطي الشأن المحلي والعربي والإقليمي.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4">أقسام سريعة</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><router-link to="/" class="hover:text-white transition">الرئيسية</router-link></li>
            <li><router-link to="/about" class="hover:text-white transition">من نحن</router-link></li>
            <li><router-link to="/contact" class="hover:text-white transition">اتصل بنا</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">اتصل بنا</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-center gap-2"><Phone :size="16" /> 00967-XXXXXXX</li>
            <li class="flex items-center gap-2"><Mail :size="16" /> info@{{ domain }}</li>
            <li class="flex items-center gap-2"><MapPin :size="16" /> الضالع - اليمن</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-t border-white/10 py-4 text-center text-sm text-gray-500">© 2026 الضالع أونلاين. جميع الحقوق محفوظة.</div>
  </footer>
</template>

<script setup lang="ts">
import { Phone, Mail, MapPin } from '@lucide/vue';
import { computed } from 'vue';
import { site } from '@/utils/site';

const domain = computed(() => site.url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
</script>

<style scoped>
.footer-surface {
  background:
    radial-gradient(circle at 18% 0%, rgb(21 77 165 / 24%), transparent 34%),
    linear-gradient(135deg, #051836, #071f49 58%, #111827);
}
</style>
