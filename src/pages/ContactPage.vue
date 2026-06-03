<template>
  <div class="min-h-screen bg-gray-50">
    <!-- هيرو -->
    <section class="bg-primary-900 text-white py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">اتصل بنا</h1>
        <p class="text-primary-200 text-lg max-w-2xl mx-auto">نحن هنا للاستماع إليك. تواصل معنا عبر أي من القنوات التالية</p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- معلومات الاتصال -->
        <div class="lg:col-span-1 space-y-6">
          <div class="card p-6 flex items-start gap-4">
            <Phone :size="24" class="text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">هاتف</h3>
              <p class="text-gray-600 text-sm">00967-XXXXXXXX</p>
              <p class="text-gray-600 text-sm">00967-XXXXXXXX</p>
            </div>
          </div>
          <div class="card p-6 flex items-start gap-4">
            <Mail :size="24" class="text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">البريد الإلكتروني</h3>
              <p class="text-gray-600 text-sm">info@aldhalea-online.com</p>
              <p class="text-gray-600 text-sm">editor@aldhalea-online.com</p>
            </div>
          </div>
          <div class="card p-6 flex items-start gap-4">
            <MapPin :size="24" class="text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">العنوان</h3>
              <p class="text-gray-600 text-sm">الضالع - اليمن</p>
              <p class="text-gray-600 text-sm">شارع التحرير - أمام البنك المركزي</p>
            </div>
          </div>
          <div class="card p-6 flex items-start gap-4">
            <Clock :size="24" class="text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-bold mb-1">ساعات العمل</h3>
              <p class="text-gray-600 text-sm">السبت - الخميس: 8 ص - 10 م</p>
              <p class="text-gray-600 text-sm">الجمعة: 4 م - 9 م</p>
            </div>
          </div>
        </div>

        <!-- نموذج الاتصال -->
        <div class="lg:col-span-2 card p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-6">أرسل رسالة</h2>
          <form @submit.prevent="submitForm" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium mb-2">الاسم الكامل *</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition" placeholder="الاسم الكامل" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition" placeholder="example@email.com" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">الموضوع *</label>
              <input v-model="form.subject" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition" placeholder="موضوع الرسالة" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">الرسالة *</label>
              <textarea v-model="form.message" rows="5" required class="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition resize-none" placeholder="اكتب رسالتك هنا..."></textarea>
            </div>
            <button type="submit" class="btn-primary w-full md:w-auto" :disabled="submitted">
              {{ submitted ? 'تم الإرسال ✓' : 'إرسال الرسالة' }}
            </button>
          </form>
        </div>
      </div>

      <!-- الخريطة -->
      <div class="mt-12 card overflow-hidden rounded-2xl">
        <div class="aspect-[21/9] bg-gray-200 flex items-center justify-center">
          <MapPin :size="48" class="text-gray-400" />
          <span class="text-gray-500 mr-2">الضالع - اليمن</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Phone, Mail, MapPin, Clock } from '@lucide/vue';

const form = reactive({ name: '', email: '', subject: '', message: '' });
const submitted = ref(false);

function submitForm() {
  console.log('Form submitted:', form);
  submitted.value = true;
  setTimeout(() => {
    submitted.value = false;
    form.name = ''; form.email = ''; form.subject = ''; form.message = '';
  }, 3000);
}
</script>
