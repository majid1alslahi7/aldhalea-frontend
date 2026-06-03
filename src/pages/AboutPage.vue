<template>
  <div class="min-h-screen bg-gray-50">
    <!-- هيرو -->
    <section class="bg-primary-900 text-white py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">من نحن</h1>
        <p class="text-primary-200 text-lg max-w-2xl mx-auto">تعرف على الضالع أونلاين - منصتك الإخبارية الشاملة</p>
      </div>
    </section>

    <!-- المحتوى -->
    <section class="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold mb-6">قصتنا</h2>
          <div class="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>تأسس موقع <strong class="text-primary-700">الضالع أونلاين</strong> ليكون نافذة إعلامية رقمية شاملة تنقل مستجدات محافظة الضالع وتغطي الشأن المحلي واليمني والعربي والإقليمي.</p>
            <p>نحن فريق من الصحفيين والمحررين المحترفين نعمل على مدار الساعة لنقدم لكم تغطية إخبارية موثوقة وتحليلات عميقة وتقارير ميدانية حصرية.</p>
            <p>شعارنا <strong class="text-primary-700">"أينما كنتَ.. نُحيطكَ بالخبر"</strong> يعكس التزامنا بتوصيل الخبر لكم أينما كنتم.</p>
          </div>
        </div>
        <div class="bg-primary-50 rounded-2xl p-8 text-center">
          <div class="w-24 h-24 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 shadow-xl shadow-primary-600/30">ض</div>
          <h3 class="text-xl font-bold text-primary-900 mb-2">الضالع أونلاين</h3>
          <p class="text-gray-500">منصة إخبارية رقمية منذ 2024</p>
        </div>
      </div>

      <!-- رؤيتنا ورسالتنا -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="card p-6 md:p-8">
          <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
            <Eye :size="28" class="text-primary-600" />
          </div>
          <h3 class="text-xl font-bold mb-3">رؤيتنا</h3>
          <p class="text-gray-600">أن نكون المنصة الإخبارية الأولى والأكثر مصداقية في محافظة الضالع واليمن.</p>
        </div>
        <div class="card p-6 md:p-8">
          <div class="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
            <Target :size="28" class="text-amber-600" />
          </div>
          <h3 class="text-xl font-bold mb-3">رسالتنا</h3>
          <p class="text-gray-600">تقديم محتوى إخباري مهني وموضوعي يخدم المجتمع ويساهم في رفع الوعي العام.</p>
        </div>
      </div>

      <!-- قيمنا -->
      <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center">قيمنا</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="card p-5 text-center">
          <Shield :size="32" class="text-primary-600 mx-auto mb-3" />
          <h4 class="font-bold text-sm">المصداقية</h4>
        </div>
        <div class="card p-5 text-center">
          <Zap :size="32" class="text-amber-500 mx-auto mb-3" />
          <h4 class="font-bold text-sm">السرعة</h4>
        </div>
        <div class="card p-5 text-center">
          <Lock :size="32" class="text-green-600 mx-auto mb-3" />
          <h4 class="font-bold text-sm">الشفافية</h4>
        </div>
        <div class="card p-5 text-center">
          <Heart :size="32" class="text-red-500 mx-auto mb-3" />
          <h4 class="font-bold text-sm">المهنية</h4>
        </div>
      </div>

      <!-- إحصائيات -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
        <div class="card p-6 text-center">
          <span class="text-3xl md:text-4xl font-extrabold text-primary-600">+15</span>
          <p class="text-sm text-gray-500 mt-1">صحفي ومحرر</p>
        </div>
        <div class="card p-6 text-center">
          <span class="text-3xl md:text-4xl font-extrabold text-primary-600">+5000</span>
          <p class="text-sm text-gray-500 mt-1">خبر سنوياً</p>
        </div>
        <div class="card p-6 text-center">
          <span class="text-3xl md:text-4xl font-extrabold text-primary-600">+100K</span>
          <p class="text-sm text-gray-500 mt-1">قارئ شهرياً</p>
        </div>
        <div class="card p-6 text-center">
          <span class="text-3xl md:text-4xl font-extrabold text-primary-600">10</span>
          <p class="text-sm text-gray-500 mt-1">مديريات نغطيها</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Eye, Target, Shield, Zap, Lock, Heart } from '@lucide/vue';
</script>
