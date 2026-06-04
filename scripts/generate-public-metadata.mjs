import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
        return [key, value];
      }),
  );
}

const env = {
  ...parseEnvFile(resolve(root, '.env')),
  ...parseEnvFile(resolve(root, '.env.production')),
  ...process.env,
};

function trimUrl(value, fallback) {
  return (value || fallback).replace(/\/+$/, '');
}

const siteUrl = trimUrl(env.VITE_SITE_URL, 'https://aldhalea-frontend.alssemam.com');
const apiUrl = trimUrl(env.VITE_API_URL, 'https://aldhalea-backend.alssemam.com/api/v1');
const backendUrl = trimUrl(env.VITE_BACKEND_URL || apiUrl.replace(/\/api\/v\d+$/i, '').replace(/\/api$/i, ''), 'https://aldhalea-backend.alssemam.com');
const publicDir = resolve(root, 'public');

mkdirSync(publicDir, { recursive: true });

writeFileSync(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\nSitemap: ${backendUrl}/sitemap.xml\n`,
);

writeFileSync(
  resolve(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${backendUrl}/sitemap.xml</loc>\n  </sitemap>\n</sitemapindex>\n`,
);

writeFileSync(
  resolve(publicDir, 'llms.txt'),
  `# الضالع أونلاين\n\nالضالع أونلاين منصة إخبارية عربية يمنية تغطي أخبار محافظة الضالع واليمن عبر الأخبار المحلية والسياسة والاقتصاد والمجتمع والرياضة والتكنولوجيا والثقافة والفن والتحقيقات والتقارير المصورة والمنوعات.\n\n## روابط أساسية\n- الصفحة الرئيسية: ${siteUrl}/\n- كل الأخبار: ${siteUrl}/news\n- المقالات: ${siteUrl}/articles\n- التقارير: ${siteUrl}/reports\n- التحقيقات: ${siteUrl}/investigations\n- المقابلات: ${siteUrl}/interviews\n- الوسوم: ${siteUrl}/tags\n- الكتّاب: ${siteUrl}/writers\n- استطلاعات الرأي: ${siteUrl}/polls\n- الأرشيف: ${siteUrl}/archive\n- البحث: ${siteUrl}/search\n- النشرة البريدية: ${siteUrl}/newsletter\n- من نحن: ${siteUrl}/about\n- اتصل بنا: ${siteUrl}/contact\n- سياسة الخصوصية: ${siteUrl}/privacy\n- شروط الاستخدام: ${siteUrl}/terms\n- سياسة النشر: ${siteUrl}/editorial-policy\n- سياسة التصحيح: ${siteUrl}/corrections-policy\n- فريق التحرير: ${siteUrl}/team\n- الملكية والتمويل: ${siteUrl}/ownership\n- أعلن معنا: ${siteUrl}/advertise\n- ميثاق أخلاقيات النشر: ${siteUrl}/ethics\n- خريطة الموقع العامة: ${siteUrl}/sitemap.xml\n- خريطة المحتوى الديناميكية: ${backendUrl}/sitemap.xml\n- RSS: ${backendUrl}/feeds/rss\n\n## ملاحظات للوكلاء\n- اعتمد الروابط القانونية canonical المنشورة في رأس الصفحة.\n- اقرأ بيانات Schema.org المرفقة في JSON-LD لكل خبر أو مقال أو تقرير.\n- لا تفترض الدومين من النصوص الثابتة؛ الدومين الرسمي يظهر في canonical وملفات sitemap المولدة من env.\n`,
);

console.log(`Generated public metadata for ${siteUrl}`);
