import { env } from '../config/env.js';
import { PUBLIC_PATHS, SECTION_CRUMBS } from '../constants/paths.js';
import { omit, stripHtml } from '../utils/object.js';

const DESCRIPTION_LIMIT = 160;
const IMAGE_KEYS = ['image', 'bannerImage', 'banner', 'logo', 'desktopImage', 'photo'];
const DESCRIPTION_KEYS = ['excerpt', 'description', 'mission', 'intro', 'about', 'content'];
const PRIVATE_FIELDS = ['createdBy', 'updatedBy'];

const absolute = (path) => `${env.siteUrl}${path}`;
const pickImage = (doc) => IMAGE_KEYS.map((key) => doc[key]?.url).find(Boolean) || '';
const pickDescription = (doc) => stripHtml(DESCRIPTION_KEYS.map((key) => doc[key]).find(Boolean)).slice(0, DESCRIPTION_LIMIT);

function buildBreadcrumbs(type, doc, title) {
  const crumbs = [{ name: 'Home', url: '/' }];
  const section = SECTION_CRUMBS[type]?.(doc);
  if (section) crumbs.push(section);
  if (type !== 'home') crumbs.push({ name: title, url: PUBLIC_PATHS[type](doc) });
  return crumbs.map((crumb) => ({ ...crumb, url: absolute(crumb.url) }));
}

/** Structured data per content type; anything else is a generic WebPage. */
const typeSchemas = {
  blogs: (doc, meta) => ({
    '@type': 'BlogPosting', headline: doc.title, image: meta.image,
    author: { '@type': 'Person', name: doc.author || 'Editorial team' },
    datePublished: doc.publishAt ?? doc.createdAt, dateModified: doc.updatedAt,
  }),
  offers: (doc, meta) => ({ '@type': 'WebPage', image: meta.image, datePublished: doc.validFrom, expires: doc.validTill }),
  airlines: (doc, meta) => ({ '@type': 'Airline', name: doc.name, iataCode: doc.code, logo: meta.image }),
  destinations: (doc, meta) => ({ '@type': 'TouristDestination', name: doc.name, image: meta.image }),
  contactPage: () => ({ '@type': 'ContactPage' }),
  pages: (doc) => ({ '@type': doc.key === 'about' ? 'AboutPage' : 'WebPage' }),
};

/**
 * Everything a frontend needs to render SEO tags: title, description, canonical, robots,
 * Open Graph, breadcrumbs and JSON-LD (page + BreadcrumbList + FAQPage when FAQs exist).
 * @param {string} type  Resource name ("routes", "blogs"...), "pages", "home", "helpCenter" or "contactPage"
 */
export function buildSeo(type, doc) {
  const seo = doc.seo ?? {};
  const title = seo.metaTitle || doc.title || doc.name || doc.heading || 'Home';
  const url = absolute(PUBLIC_PATHS[type](doc));
  const meta = {
    title,
    description: seo.metaDescription || pickDescription(doc),
    image: seo.ogImage?.url || pickImage(doc),
    url,
  };
  const breadcrumbs = buildBreadcrumbs(type, doc, doc.name || doc.title || title);
  const faqs = doc.faqs ?? doc.topics ?? [];
  const schema = (typeSchemas[type] ?? (() => ({ '@type': 'WebPage' })))(doc, meta);

  const jsonLd = [
    { '@context': 'https://schema.org', name: title, description: meta.description, url, ...schema },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.url,
      })),
    },
  ];
  if (faqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question', name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(faq.answer) },
      })),
    });
  }

  return {
    title,
    description: meta.description,
    keywords: seo.keywords || '',
    canonical: seo.canonicalUrl || url,
    robots: seo.noindex ? 'noindex, nofollow' : 'index, follow',
    og: { title, description: meta.description, image: meta.image, url, type: type === 'blogs' ? 'article' : 'website' },
    breadcrumbs,
    jsonLd,
  };
}

/** Public representation of a document: private fields removed, computed `seo` attached. */
export function toPublicJson(type, json) {
  const clean = omit(json, PRIVATE_FIELDS);
  return { ...clean, seo: buildSeo(type, clean) };
}
