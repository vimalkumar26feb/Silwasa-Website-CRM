import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://silwasa.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Core Service detail pages
  const serviceSlugs = [
    'website-design-development',
    'custom-website-development',
    'business-website-development',
    'ecommerce-website-development',
    'web-application-development',
    'custom-software-development',
    'reactjs-development',
    'nodejs-development',
    'ui-ux-design',
    'search-engine-optimization',
    'social-media-marketing',
    'website-maintenance',
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Industry detail pages
  const industrySlugs = [
    'healthcare',
    'real-estate',
    'ecommerce-retail',
    'fintech-banking',
    'logistics-supply-chain',
    'education-edtech',
  ];

  const industryRoutes: MetadataRoute.Sitemap = industrySlugs.map((slug) => ({
    url: `${BASE_URL}/industries/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Portfolio detail pages
  const portfolioSlugs = [
    'healthflow-telemetry-portal',
    'apex-real-estate-crm',
    'luxor-ecommerce-storefront',
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioSlugs.map((slug) => ({
    url: `${BASE_URL}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Blog article pages
  const blogSlugs = [
    'nextjs-15-vs-traditional-react-enterprise-performance',
    'generative-engine-optimization-geo-future-of-seo',
    'architecting-high-concurrency-microservices-nodejs',
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...portfolioRoutes,
    ...blogRoutes,
  ];
}
