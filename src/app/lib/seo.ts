/** Canonical origin for crawlers, sitemaps, and Open Graph. */
export const SITE_ORIGIN = 'https://odi.studio';

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/product-image/5.jpg`;

export type SeoPage = {
  title: string;
  description: string;
  robots?: string;
  image?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | null;
};

type ResolvedSeo = {
  title: string;
  description: string;
  robots: string;
  canonical: string;
  image: string;
  ogType: string;
  jsonLd: Record<string, unknown> | null;
};

const DEFAULT_DESCRIPTION =
  'ODI Studio creates stereoscopic 3D conversion, VR, and immersive advertising — plus ODI Kids 3D learning books for children in India.';

const PAGES: Record<string, SeoPage> = {
  '/': {
    title: 'ODI Studio | Stereoscopic 3D, VR & Immersive Media',
    description: DEFAULT_DESCRIPTION,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'ODI Studio',
          url: SITE_ORIGIN,
          logo: `${SITE_ORIGIN}/Logo.svg`,
        },
        {
          '@type': 'WebSite',
          name: 'ODI Studio',
          url: SITE_ORIGIN,
        },
      ],
    },
  },
  '/products': {
    title: '3D Learning Books for Kids | ODI Kids Shop',
    description:
      'Shop ODI Kids stereoscopic 3D learning kits for ages 6–14. Space Explorer and more volumes with 3D glasses, explorer cards, and free shipping across India.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'ODI Kids 3D Learning Books',
          url: `${SITE_ORIGIN}/products`,
          description:
            'Stereoscopic 3D learning kits for kids — Space Explorer and upcoming explorer volumes.',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How does the 3D learning work?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Each kit includes a stereoscopic book and 3D glasses. Pages and explorer cards use depth layers so kids see content pop off the page.',
              },
            },
            {
              '@type': 'Question',
              name: 'What age group is ODI Kids for?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Kits are designed for ages 6–14 depending on the volume. Space Explorer is ideal for ages 6–12.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you offer Cash on Delivery?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes — pay when your kit arrives. Free shipping is included on all orders across India.',
              },
            },
          ],
        },
      ],
    },
  },
  '/products/space-explorer': {
    title: 'Space Explorer 3D Book | ODI Kids',
    description:
      'Space Explorer is a stereoscopic 3D learning kit for ages 6–12 — planets, stars, and explorer cards with 3D glasses. Shop ODI Kids.',
  },
  '/odi-kids': {
    title: 'ODI Kids | 3D Learning Books for Children',
    description:
      'ODI Kids makes stereoscopic 3D books that turn science and exploration into hands-on learning for children.',
  },
  '/kids': {
    title: 'ODI Kids | 3D Learning Books for Children',
    description:
      'ODI Kids makes stereoscopic 3D books that turn science and exploration into hands-on learning for children.',
  },
  '/about': {
    title: 'About ODI Studio | Stereo Labs',
    description:
      'ODI Studio is a stereoscopic 3D and immersive media studio — conversion, VR, advertising, and ODI Kids learning books.',
  },
  '/services': {
    title: '3D & Immersive Services | ODI Studio',
    description:
      'Stereo conversion and 3D books from ODI Studio — plus short films, vertical video, advertising, compositing, and spatial formats.',
  },
  '/industries': {
    title: 'Industries | ODI Studio',
    description:
      'Stereoscopic 3D and immersive production for film, education, advertising, and experiential brands.',
  },
  '/services/3d-movie-conversion': {
    title: '3D Movie Conversion | ODI Studio',
    description:
      '2D-to-3D movie conversion with stereoscopic depth, quality control, and delivery for theatrical and streaming.',
  },
  '/services/3d-books': {
    title: '3D Books | ODI Studio',
    description:
      'Stereoscopic 3D books and learning kits — print-ready depth, glasses, and explorer cards for education brands.',
  },
  '/careers': {
    title: 'Careers | ODI Studio',
    description: 'Join ODI Studio — stereoscopic 3D, VR, and immersive production roles.',
  },
  '/contact': {
    title: 'Contact | ODI Studio',
    description: 'Contact ODI Studio for 3D conversion, VR, advertising, or ODI Kids wholesale and orders.',
  },
  '/learn-more': {
    title: 'Learn More | ODI Studio',
    description: 'How ODI stereoscopic 3D and ODI Kids learning kits work — process, glasses, and delivery.',
  },
  '/privacy': {
    title: 'Privacy Policy | ODI Studio',
    description: 'How ODI Studio collects, uses, and protects personal information.',
  },
  '/terms': {
    title: 'Terms of Service | ODI Studio',
    description: 'Terms of service for ODI Studio websites, services, and ODI Kids orders.',
  },
  '/cookies': {
    title: 'Cookie Policy | ODI Studio',
    description: 'How ODI Studio uses cookies and similar technologies on odi.studio.',
  },
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function isPrivatePath(path: string): boolean {
  return (
    path.startsWith('/dashboard') ||
    path.startsWith('/checkout') ||
    path === '/login' ||
    path === '/register'
  );
}

export function getSeoForPath(pathname: string): ResolvedSeo {
  const path = normalizePath(pathname);

  if (isPrivatePath(path)) {
    const label = path.startsWith('/dashboard')
      ? 'Dashboard'
      : path.startsWith('/checkout')
        ? 'Checkout'
        : path === '/register'
          ? 'Create account'
          : 'Sign in';
    return {
      title: `${label} | ODI Studio`,
      description: DEFAULT_DESCRIPTION,
      robots: 'noindex, nofollow',
      canonical: `${SITE_ORIGIN}${path}`,
      image: DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: null,
    };
  }

  const page = PAGES[path];
  return {
    title: page?.title ?? 'ODI Studio',
    description: page?.description ?? DEFAULT_DESCRIPTION,
    robots: page?.robots ?? 'index, follow',
    canonical: `${SITE_ORIGIN}${path === '/' ? '/' : path}`,
    image: page?.image ?? DEFAULT_OG_IMAGE,
    ogType: page?.ogType ?? 'website',
    jsonLd: page?.jsonLd ?? null,
  };
}
