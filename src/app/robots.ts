import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://djbokep.online';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', // Mencegah bot mengindeks halaman admin
        '/api/',   // Mencegah bot mengindeks route API
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
