"use client";

import {
    STRUCTURED_DATA,
    generateProductSchema,
    generateBreadcrumbSchema,
    generateFAQSchema,
    SITE_CONFIG
} from "@/lib/seo-config";

// Organization Schema Component
export function OrganizationSchema() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(STRUCTURED_DATA.organization),
            }}
        />
    );
}

// Local Business Schema Component
export function LocalBusinessSchema() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(STRUCTURED_DATA.localBusiness),
            }}
        />
    );
}

// Product Schema Component
interface ProductSchemaProps {
    product: {
        name: string;
        description: string;
        price: number;
        discountedPrice?: number;
        image: string;
        sku: string;
        slug: string;
        brand?: string;
        category?: string;
        inStock: boolean;
        rating?: number;
        reviewCount?: number;
    };
}

export function ProductSchema({ product }: ProductSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        sku: product.sku,
        brand: {
            "@type": "Brand",
            name: product.brand || SITE_CONFIG.name,
        },
        category: product.category,
        offers: {
            "@type": "Offer",
            url: `${SITE_CONFIG.url}/products/${product.slug}`,
            priceCurrency: "PKR",
            price: product.discountedPrice || product.price,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: SITE_CONFIG.name,
            },
        },
        ...(product.rating && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 1,
                bestRating: "5",
                worstRating: "1",
            },
        }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Breadcrumb Schema Component
interface BreadcrumbSchemaProps {
    items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = generateBreadcrumbSchema(items);
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// FAQ Schema Component
interface FAQSchemaProps {
    faqs: { question: string; answer: string }[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
    const schema = generateFAQSchema(faqs);
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Category/Collection Schema
interface CollectionSchemaProps {
    name: string;
    description: string;
    url: string;
    products: Array<{
        name: string;
        url: string;
        image: string;
        price: number;
    }>;
}

export function CollectionSchema({ name, description, url, products }: CollectionSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Product",
                    name: product.name,
                    url: product.url,
                    image: product.image,
                    offers: {
                        "@type": "Offer",
                        priceCurrency: "PKR",
                        price: product.price,
                    },
                },
            })),
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Search Box Schema (for site search)
export function SearchBoxSchema() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(STRUCTURED_DATA.website),
            }}
        />
    );
}
