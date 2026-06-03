<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-4xl px-4 py-8">
      <article class="card p-5 md:p-8">
        <p class="text-sm font-bold text-red-600">{{ page.eyebrow }}</p>
        <h1 class="mt-2 text-3xl font-extrabold text-primary-950">{{ page.title }}</h1>
        <p class="mt-3 leading-8 text-gray-500">{{ page.description }}</p>

        <div class="mt-8 space-y-7">
          <section v-for="section in page.sections" :key="section.title">
            <h2 class="mb-3 text-xl font-extrabold">{{ section.title }}</h2>
            <p class="leading-9 text-gray-600">{{ section.body }}</p>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { applySeo } from '@/utils/seo';

const route = useRoute();

const pages = {
  privacy: {
    eyebrow: 'الثقة والبيانات',
    title: 'سياسة الخصوصية',
    description: 'نوضح هنا كيف يتعامل الضالع أونلاين مع بيانات الزوار والاشتراكات والتواصل.',
    sections: [
      { title: 'البيانات التي نجمعها', body: 'قد نجمع بيانات محدودة يرسلها الزائر طوعاً مثل الاسم والبريد الإلكتروني عند الاشتراك في النشرة أو استخدام نموذج التواصل.' },
      { title: 'استخدام البيانات', body: 'تستخدم البيانات للرد على الرسائل وتحسين الخدمة وإرسال النشرة عند طلبها، ولا نبيع بيانات الزوار أو نشاركها تجارياً.' },
      { title: 'ملفات القياس', body: 'قد تستخدم أدوات قياس الزيارات لفهم أداء الموقع والمواد الأكثر قراءة، مع الحرص على تقليل البيانات الشخصية قدر الإمكان.' },
    ],
  },
  terms: {
    eyebrow: 'قواعد الاستخدام',
    title: 'شروط الاستخدام',
    description: 'استخدامك للموقع يعني قبول هذه الشروط العامة الخاصة بالمحتوى والخدمات.',
    sections: [
      { title: 'المحتوى', body: 'ينشر الموقع أخباراً ومقالات وتقارير لأغراض إعلامية وتثقيفية، ولا يعد بديلاً عن الاستشارة القانونية أو الطبية أو المالية المتخصصة.' },
      { title: 'إعادة النشر', body: 'يسمح بالاقتباس المحدود مع ذكر المصدر ورابط المادة الأصلي، ولا يسمح بنسخ المحتوى كاملاً دون إذن واضح.' },
      { title: 'سلوك المستخدم', body: 'يجب أن تخلو التعليقات والرسائل من الإساءة والتحريض وانتهاك الخصوصية، ويحق للموقع حجب أي محتوى مخالف.' },
    ],
  },
  editorial: {
    eyebrow: 'معايير التحرير',
    title: 'سياسة النشر',
    description: 'تحدد هذه السياسة طريقة اختيار الأخبار والتعامل مع المصادر والصياغة والتحقق.',
    sections: [
      { title: 'المصادر', body: 'نعتمد على مصادر رسمية وعامة وموثوقة قدر الإمكان، ونوضح مصدر المعلومات عندما يكون ذلك ضرورياً لفهم السياق.' },
      { title: 'الصياغة', body: 'نعيد تقديم المعلومات بلغة واضحة ومحلية مع فصل الخبر عن الرأي والتحليل، ونحرص على عدم تضخيم العناوين.' },
      { title: 'التوازن', body: 'في الملفات الخلافية نسعى لعرض السياق والآراء ذات الصلة وعدم اختزال القضايا المعقدة في رواية واحدة.' },
    ],
  },
  corrections: {
    eyebrow: 'الدقة والشفافية',
    title: 'سياسة التصحيح',
    description: 'الدقة جزء أساسي من ثقة القارئ، لذلك نوفر آلية واضحة للتنبيه والتصحيح.',
    sections: [
      { title: 'طلب التصحيح', body: 'يمكن إرسال طلب التصحيح عبر صفحة اتصل بنا مع رابط المادة ووصف الخطأ والمعلومة الصحيحة أو مصدرها.' },
      { title: 'المراجعة', body: 'يراجع فريق التحرير الطلب، وإذا ثبت الخطأ يتم تعديل المادة أو إضافة توضيح بحسب طبيعة الخطأ.' },
      { title: 'الأرشفة', body: 'نحافظ على الروابط الأصلية قدر الإمكان حتى لا تنكسر الإحالات، ونفضل التحديث الشفاف على الحذف إلا عند الضرورة.' },
    ],
  },
};

const page = computed(() => pages[(route.meta.staticPage as keyof typeof pages) || 'privacy']);

watch(
  () => route.fullPath,
  () => applySeo({ title: page.value.title, description: page.value.description, path: route.fullPath }),
  { immediate: true },
);
</script>
