// Centralized SEO Configuration for Electro Sultani

export const SITE_CONFIG = {
    name: "Electro Sultani",
    companyName: "Electro Sultani Corporation",
    title: "Electro Sultani - Best Solar Panels & Energy Solutions in Pakistan",
    shortName: "ElectroSultani",
    description: "Electro Sultani is one of the leading Solar Solution Providers in Pakistan. Premium solar panels, inverters & batteries at best prices. Professional installation services across Pakistan. Save up to 80% on electricity bills! Established since 1969.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://electrosultani.com",
    ogImage: "/og-image.jpg",
    locale: "en_PK",
    themeColor: "#22c55e",
    establishedYear: "1969",

    // Contact Information
    contact: {
        email: "info@sultani.pk",
        phone: "0322 7858264",
        phoneFormatted: "+92 322 7858264",
        whatsapp: "+923227858264",
        address: "Dara Araian, Mujahid Rd, Rehmat Pura Dara Arain, Sialkot, 51310",
        city: "Sialkot",
        region: "Punjab",
        country: "Pakistan",
        postalCode: "51310",
    },

    // Social Media
    social: {
        facebook: "https://facebook.com/sultanisolar",
        instagram: "https://instagram.com/sultani.pk",
        twitter: "https://twitter.com/sultanisolar",
        youtube: "https://www.youtube.com/@sultanisolar",
        tiktok: "https://tiktok.com/@sultani.pk",
        linkedin: "https://linkedin.com/company/sultanisolar",
    },

    // Business Hours
    openingHours: {
        weekdays: "09:00-18:00",
        saturday: "10:00-16:00",
        sunday: "Closed",
    },
};

// Target Keywords organized by category
export const SEO_KEYWORDS = {
    primary: [
        "solar panels Pakistan",
        "solar energy Pakistan",
        "solar system Pakistan",
        "solar power Pakistan",
        "solar panel price Pakistan",
        "best solar panels Pakistan",
        "solar inverters Pakistan",
        "solar batteries Pakistan",
    ],
    secondary: [
        "residential solar power systems Pakistan",
        "commercial solar panels Pakistan",
        "off-grid solar solutions Pakistan",
        "grid-tied solar system Pakistan",
        "solar battery storage Pakistan",
        "hybrid solar inverter Pakistan",
        "on-grid solar system Pakistan",
    ],
    localKeywords: [
        "solar panels Sialkot",
        "solar panels Lahore",
        "solar panels Karachi",
        "solar panels Islamabad",
        "solar installation Pakistan",
        "solar installation Sialkot",
        "solar company Pakistan",
        "best solar company Pakistan",
    ],
    brands: [
        "Longi solar panels Pakistan",
        "Jinko solar panels Pakistan",
        "Canadian Solar Pakistan",
        "Trina Solar Pakistan",
        "JA Solar Pakistan",
        "Huawei inverter Pakistan",
        "Growatt inverter Pakistan",
    ],
    longTail: [
        "how much do solar panels cost in Pakistan",
        "5kW solar system price Pakistan",
        "10kW solar system price Pakistan",
        "is solar worth it in Pakistan",
        "solar panel installation cost Pakistan",
        "best solar panel brand in Pakistan 2024",
        "solar system financing Pakistan",
    ],
};

// Page-specific SEO configurations
export const PAGE_SEO = {
    home: {
        title: "ElectroSultani - #1 Solar Energy Solutions & Panels in Pakistan | Best Prices",
        description: "Pakistan's leading solar energy provider. Shop premium solar panels, inverters & batteries at best prices. Free installation consultation. Save up to 80% on electricity bills with ElectroSultani!",
        keywords: [
            ...SEO_KEYWORDS.primary,
            "solar energy solutions",
            "buy solar panels online",
            "solar shop Pakistan",
        ],
    },
    products: {
        title: "Solar Panels, Inverters & Batteries - Buy Online | ElectroSultani Pakistan",
        description: "Browse our complete range of solar panels, inverters, batteries & accessories. Best prices in Pakistan with warranty. Longi, Jinko, Canadian Solar, Huawei & more top brands available.",
        keywords: [
            "buy solar panels online Pakistan",
            "solar products Pakistan",
            "solar equipment Pakistan",
            ...SEO_KEYWORDS.brands,
        ],
    },
    categories: {
        solarPanels: {
            title: "Best Solar Panels in Pakistan 2024 - Longi, Jinko, Canadian | ElectroSultani",
            description: "Buy premium quality solar panels in Pakistan. Mono PERC, Bifacial & N-Type panels from Longi, Jinko, Canadian Solar. Best prices with warranty. Free delivery on orders above PKR 50,000.",
            keywords: ["solar panels Pakistan", "mono solar panels", "bifacial solar panels", ...SEO_KEYWORDS.brands.filter(k => k.includes("solar"))],
        },
        inverters: {
            title: "Solar Inverters Pakistan - Hybrid, On-Grid, Off-Grid | ElectroSultani",
            description: "Shop best solar inverters in Pakistan. Huawei, Growatt, Solis hybrid inverters. On-grid & off-grid solutions. Expert installation & after-sales support.",
            keywords: ["solar inverter Pakistan", "hybrid inverter Pakistan", "Huawei inverter", "Growatt inverter"],
        },
        batteries: {
            title: "Solar Batteries Pakistan - Lithium & Tubular Batteries | ElectroSultani",
            description: "Best solar batteries in Pakistan for energy storage. Lithium-ion & tubular batteries for solar systems. Long warranty, reliable performance. Buy online with free delivery.",
            keywords: ["solar battery Pakistan", "lithium battery solar", "tubular battery Pakistan"],
        },
    },
    about: {
        title: "About Electro Sultani - Pakistan's Trusted Solar Company Since 1969",
        description: "Electro Sultani is one of the leading solar solution providers in Pakistan, established since 1969. We provide premium quality products and expert installations across the country.",
        keywords: ["about electro sultani", "electro sultani corporation", "solar company Pakistan", "solar energy company sialkot"],
    },
    contact: {
        title: "Contact Us - Electro Sultani Pakistan | Sialkot",
        description: "Contact Electro Sultani for solar panel installation quotes & support. Call 0322 7858264 or visit us at Dara Araian, Mujahid Rd, Sialkot.",
        keywords: ["contact electro sultani", "solar installation sialkot", "solar company contact"],
    },
};

// Structured Data Templates
export const STRUCTURED_DATA = {
    organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/logo.png`,
        description: SITE_CONFIG.description,
        email: SITE_CONFIG.contact.email,
        telephone: SITE_CONFIG.contact.phone,
        address: {
            "@type": "PostalAddress",
            streetAddress: SITE_CONFIG.contact.address,
            addressLocality: SITE_CONFIG.contact.city,
            addressRegion: SITE_CONFIG.contact.region,
            postalCode: SITE_CONFIG.contact.postalCode,
            addressCountry: SITE_CONFIG.contact.country,
        },
        sameAs: Object.values(SITE_CONFIG.social),
    },

    localBusiness: {
        "@context": "https://schema.org",
        "@type": "ElectronicsStore",
        name: SITE_CONFIG.name,
        image: `${SITE_CONFIG.url}/logo.png`,
        url: SITE_CONFIG.url,
        telephone: SITE_CONFIG.contact.phone,
        email: SITE_CONFIG.contact.email,
        address: {
            "@type": "PostalAddress",
            streetAddress: SITE_CONFIG.contact.address,
            addressLocality: SITE_CONFIG.contact.city,
            addressRegion: SITE_CONFIG.contact.region,
            postalCode: SITE_CONFIG.contact.postalCode,
            addressCountry: "PK",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 32.4945,
            longitude: 74.5229,
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "10:00",
                closes: "16:00",
            },
        ],
        priceRange: "$$",
        currenciesAccepted: "PKR",
        paymentAccepted: ["Cash", "Bank Transfer", "JazzCash", "Easypaisa"],
    },

    website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_CONFIG.url}/products?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    },
};

// Helper function to generate product structured data
export function generateProductSchema(product: {
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    image: string;
    sku: string;
    brand?: string;
    category?: string;
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
}) {
    return {
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
            url: `${SITE_CONFIG.url}/products/${product.sku}`,
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
            },
        }),
    };
}

// Helper function to generate breadcrumb schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

// FAQ Schema generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
