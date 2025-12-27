import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/lib/seo-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_CONFIG.url;
    const supabase = await createClient();

    // Fetch products
    const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);

    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, updated_at')
        .eq('is_active', true);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Product pages
    const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = (categories || []).map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(category.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
}
