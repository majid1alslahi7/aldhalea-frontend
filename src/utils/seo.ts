import { assetUrl, routeUrl, site } from './site';

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  url?: string;
  image?: string | null;
  type?: 'website' | 'article';
  keywords?: string | string[];
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  noindex?: boolean;
  jsonLd?: JsonLd;
}

function clean(value: string | null | undefined): string {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function fullTitle(title?: string): string {
  const value = clean(title) || site.name;
  return value.includes(site.name) ? value : `${value} | ${site.name}`;
}

function ensureMeta(attribute: 'name' | 'property', key: string): HTMLMetaElement {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  return element;
}

function setMeta(attribute: 'name' | 'property', key: string, value?: string | null) {
  const content = clean(value);
  if (!content) return;
  ensureMeta(attribute, key).content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export function setJsonLd(id: string, data: JsonLd) {
  let element = document.getElementById(id) as HTMLScriptElement | null;
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

export function applyBaseSeo() {
  setJsonLd('site-jsonld', [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: site.name,
      url: site.url,
      logo: assetUrl('/icons/pwa-512.png'),
      sameAs: [],
      publishingPrinciples: routeUrl('/about'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      inLanguage: site.language,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${site.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]);
}

export function applySeo(input: SeoInput = {}) {
  if (typeof document === 'undefined') return;

  const title = fullTitle(input.title);
  const description = clean(input.description) || site.description;
  const canonical = input.url || routeUrl(input.path || window.location.pathname);
  const image = assetUrl(input.image || site.defaultImage);
  const type = input.type || 'website';
  const keywords = Array.isArray(input.keywords) ? input.keywords.join(', ') : input.keywords;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'robots', input.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  setMeta('name', 'keywords', keywords);
  setMeta('name', 'application-name', site.name);
  setMeta('property', 'og:locale', site.locale);
  setMeta('property', 'og:site_name', site.name);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:image', image);
  setMeta('property', 'twitter:card', 'summary_large_image');
  setMeta('property', 'twitter:title', title);
  setMeta('property', 'twitter:description', description);
  setMeta('property', 'twitter:image', image);
  setMeta('property', 'article:published_time', input.publishedTime);
  setMeta('property', 'article:modified_time', input.modifiedTime);
  setMeta('property', 'article:author', input.author);
  setLink('canonical', canonical);

  if (input.jsonLd) setJsonLd('page-jsonld', input.jsonLd);
}
