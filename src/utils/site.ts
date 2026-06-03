const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://aldhalea-frontend.alssemam.com';

function normalizeBaseUrl(value: string | undefined): string {
  const clean = (value || fallbackOrigin).trim().replace(/\/+$/, '');
  return clean || fallbackOrigin;
}

export const site = {
  name: import.meta.env.VITE_SITE_NAME || 'الضالع أونلاين',
  shortName: import.meta.env.VITE_SITE_SHORT_NAME || 'الضالع',
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    'الضالع أونلاين منصة إخبارية يمنية مستقلة تنقل أخبار محافظة الضالع واليمن وتقاريرها وتحقيقاتها ومقالاتها بعمق ومهنية.',
  url: normalizeBaseUrl(import.meta.env.VITE_SITE_URL),
  locale: 'ar_YE',
  language: 'ar',
  defaultImage: '/brand/og-image.png',
};

export function routeUrl(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${site.url}${normalizedPath}`;
}

export function assetUrl(path = site.defaultImage): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${site.url}${normalizedPath}`;
}
