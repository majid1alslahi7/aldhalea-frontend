import DOMPurify from 'dompurify';
import type { ApiEnvelope, LocalizedText } from '@/types/api';

export function localizedText(value: LocalizedText, locale = 'ar'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  return value[locale] || value.ar || value.en || Object.values(value).find(Boolean) || '';
}

export function slugValue(value: LocalizedText): string {
  return encodeURIComponent(localizedText(value));
}

export function apiData<T>(response: unknown, fallback: T): T {
  const envelope = response as Partial<ApiEnvelope<T>>;
  return envelope?.data ?? fallback;
}

export function apiArray<T>(response: unknown): T[] {
  const data = apiData<T[]>(response, []);
  return Array.isArray(data) ? data : [];
}

export function sanitizeHtml(value: LocalizedText): string {
  return DOMPurify.sanitize(localizedText(value), {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
}

export function errorMessage(error: unknown, fallback = 'تعذر تنفيذ الطلب الآن'): string {
  const maybe = error as { response?: { data?: { message?: string } }; message?: string };
  return maybe.response?.data?.message || maybe.message || fallback;
}
