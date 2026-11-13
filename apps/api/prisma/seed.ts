import { PrismaClient, UserRole } from '@prisma/client';
import argon2 from 'argon2';
import { DEFAULT_THEME, DEFAULT_BRANDING } from '@silwasa/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Silwasa CMS database seeding...');

  // 1. Create Default Super Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@silwasa.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'SilwasaAdmin2026!';
  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      email: adminEmail.toLowerCase(),
      name: 'Silwasa Super Admin',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Super Admin configured: ${superAdmin.email}`);

  // 2. Default Theme Settings
  await prisma.siteSetting.upsert({
    where: { key: 'theme' },
    update: { value: DEFAULT_THEME as object },
    create: {
      key: 'theme',
      value: DEFAULT_THEME as object,
    },
  });
  console.log('✅ Default Theme settings seeded');

  // 3. Default Branding Settings
  await prisma.siteSetting.upsert({
    where: { key: 'branding' },
    update: { value: DEFAULT_BRANDING as object },
    create: {
      key: 'branding',
      value: DEFAULT_BRANDING as object,
    },
  });
  console.log('✅ Default Branding settings seeded');

  // 4. Default Header Menu & Mega Menu Structure
  const defaultHeaderItems = [
    {
      id: 'nav-about',
      label: 'About',
      url: '/about',
      order: 1,
      isEnabled: true,
      isMegaMenu: true,
      megaMenuColumns: [
        {
          heading: 'Company',
          links: [
            { label: 'Who We Are', url: '/about', description: 'Technology partner delivering reliable enterprise web solutions' },
            { label: 'Our Story', url: '/about#story', description: 'From an ambitious tech venture to an internationally trusted engineering brand' },
            { label: 'Why Choose Us', url: '/about#why-us', description: 'Proven track record, agile sprints, transparent delivery, and ROI' },
            { label: '8-Step Work Process', url: '/about#process', description: 'Systematic 8-phase agile methodology from concept to deployment' },
          ],
          featuredItem: {
            title: 'Engineering Digital Excellence',
            description: 'We empower businesses worldwide through custom web development and scalable cloud software.',
            ctaLabel: 'Explore Our Story →',
            ctaUrl: '/about',
          },
        },
      ],
    },
    {
      id: 'nav-services',
      label: 'Services',
      url: '/services',
      order: 2,
      isEnabled: true,
      isMegaMenu: true,
      megaMenuColumns: [
        {
          heading: 'Development',
          links: [
            { label: 'Web Development', url: '/services/web-development', description: 'Custom React & Next.js applications for speed and SEO' },
            { label: 'Mobile Apps', url: '/services/mobile-apps', description: 'Cross-platform iOS and Android apps powered by Flutter' },
            { label: 'UI/UX Design', url: '/services/ui-ux-design', description: 'Design systems, wireframes, and prototypes in Figma' },
            { label: 'Custom Software', url: '/services/custom-software', description: 'Bespoke ERP, CRM, and cloud platforms' },
          ],
        },
        {
          heading: 'Solutions & Cloud',
          links: [
            { label: 'AI Solutions', url: '/services/ai-solutions', description: 'Autonomous agents, custom LLMs, and smart automation' },
            { label: 'DevOps & Cloud', url: '/services/devops-cloud', description: 'AWS, GCP, CI/CD pipelines, Docker, zero downtime' },
            { label: 'API Integration', url: '/services/api-integration', description: 'Stripe, PayPal, CRM sync, REST & GraphQL' },
            { label: 'Website Maintenance', url: '/services/maintenance', description: '24/7 security monitoring, automated backups, speed tuning' },
          ],
        },
        {
          heading: 'Digital Marketing',
          links: [
            { label: 'SEO & Local SEO', url: '/services/seo', description: 'Technical audits, schema markup, Google Maps 3-Pack' },
            { label: 'AEO & GEO Optimization', url: '/services/geo-aeo', description: 'Winning summaries in ChatGPT, Perplexity & AI Overviews' },
            { label: 'PPC & Paid Social', url: '/services/ppc-ads', description: 'High-ROI Google Ads, Meta & LinkedIn campaigns' },
          ],
        },
      ],
    },
    {
      id: 'nav-ai',
      label: 'AI Solutions',
      url: '/ai-solutions',
      order: 3,
      isEnabled: true,
    },
    {
      id: 'nav-industries',
      label: 'Industries',
      url: '/industries',
      order: 4,
      isEnabled: true,
    },
    {
      id: 'nav-packages',
      label: 'Packages',
      url: '/pricing',
      order: 5,
      isEnabled: true,
    },
    {
      id: 'nav-portfolio',
      label: 'Portfolio',
      url: '/portfolio',
      order: 6,
      isEnabled: true,
    },
    {
      id: 'nav-case-studies',
      label: 'Case Studies',
      url: '/case-studies',
      order: 7,
      isEnabled: true,
    },
    {
      id: 'nav-blog',
      label: 'Blog',
      url: '/blog',
      order: 8,
      isEnabled: true,
    },
    {
      id: 'nav-contact',
      label: 'Contact',
      url: '/contact',
      order: 9,
      isEnabled: true,
    },
  ];

  await prisma.menu.upsert({
    where: { location: 'header' },
    update: { items: defaultHeaderItems as object },
    create: {
      name: 'Main Header Navigation',
      location: 'header',
      items: defaultHeaderItems as object,
    },
  });
  console.log('✅ Default Header Menu & Mega Menu seeded');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
