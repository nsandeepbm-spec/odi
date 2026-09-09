import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { getSeoForPath } from '../lib/seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    document.title = seo.title;
    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', seo.robots);
    upsertLink('canonical', seo.canonical);
    upsertMeta('property', 'og:type', seo.ogType);
    upsertMeta('property', 'og:site_name', 'ODI Studio');
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', seo.canonical);
    upsertMeta('property', 'og:image', seo.image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', seo.image);
    upsertJsonLd('odi-jsonld', seo.jsonLd);
    upsertJsonLd('odi-jsonld-breadcrumb', seo.breadcrumb);
  }, [pathname]);

  return null;
}

/** Pathless layout so every route updates document title, canonical, and OG tags. */
export function SeoRoot() {
  return (
    <>
      <Seo />
      <Outlet />
    </>
  );
}
