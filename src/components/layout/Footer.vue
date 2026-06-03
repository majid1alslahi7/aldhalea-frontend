<template>
  <footer class="bg-primary-950 text-white mt-16">
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl font-bold">ض</div>
            <h3 class="text-xl font-bold">الضالع أونلاين</h3>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">منصة إخبارية شاملة تنقل مستجدات محافظة الضالع وتغطي الشأن المحلي والعربي والإقليمي.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4">أقسام سريعة</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><router-link to="/" class="hover:text-white transition">الرئيسية</router-link></li>
            <li><router-link to="/category/اخبار-محلية" class="hover:text-white transition">أخبار محلية</router-link></li>
            <li><router-link to="/category/سياسة" class="hover:text-white transition">سياسة</router-link></li>
            <li><router-link to="/category/اقتصاد" class="hover:text-white transition">اقتصاد</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">اتصل بنا</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-center gap-2"><Phone :size="16" /> 00967-XXXXXXX</li>
            <li class="flex items-center gap-2"><Mail :size="16" /> info@aldhalea-online.com</li>
            <li class="flex items-center gap-2"><MapPin :size="16" /> الضالع - اليمن</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-t border-white/10 py-4 text-center text-sm text-gray-500">
      © 2026 الضالع أونلاين. جميع الحقوق محفوظة.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Phone, Mail, MapPin } from 'lucide-vue-next';
</script>
