interface Product {
    name: string;
    category?: string;
    brand?: string;
    price: number;
    description?: string;
}

interface SEOMetadata {
    title: string;
    description: string;
    keywords: string[];
}

export function generateProductSEO(product: Product): SEOMetadata {
    // Generate title
    const title = `${product.name} - ${product.brand || "SultaniElectro"} | Best Price in Pakistan`;

    // Generate description
    const priceText = `PKR ${product.price.toLocaleString()}`;
    const description = product.description
        ? `${product.description.substring(0, 120)}... Buy now at ${priceText}. Free delivery on orders over PKR 50,000.`
        : `Buy ${product.name} at the best price in Pakistan. ${priceText}. Premium quality solar products with warranty. Order now!`;

    // Generate keywords
    const keywords = [
        product.name,
        product.brand || "",
        product.category || "",
        "solar panel",
        "solar energy",
        "Pakistan",
        "best price",
        "online shopping",
        "SultaniElectro",
    ].filter(Boolean);

    return {
        title: title.substring(0, 60), // SEO best practice: 50-60 chars
        description: description.substring(0, 160), // SEO best practice: 150-160 chars
        keywords,
    };
}

export function generateCategorySEO(categoryName: string, productCount: number): SEOMetadata {
    return {
        title: `${categoryName} - ${productCount} Products | SultaniElectro`,
        description: `Shop ${productCount} ${categoryName.toLowerCase()} products at SultaniElectro. Best prices, premium quality, and fast delivery across Pakistan.`,
        keywords: [categoryName, "solar products", "Pakistan", "online shopping", "SultaniElectro"],
    };
}

export function generateBrandSEO(brandName: string, productCount: number): SEOMetadata {
    return {
        title: `${brandName} Products - ${productCount} Items | SultaniElectro`,
        description: `Explore ${productCount} ${brandName} products at SultaniElectro. Authorized dealer with best prices and genuine products. Shop now!`,
        keywords: [brandName, "authorized dealer", "genuine products", "Pakistan", "SultaniElectro"],
    };
}

export function generateSearchSEO(query: string, resultCount: number): SEOMetadata {
    return {
        title: `Search Results for "${query}" - ${resultCount} Products Found`,
        description: `Found ${resultCount} products matching "${query}". Browse solar panels, inverters, batteries and more at SultaniElectro.`,
        keywords: [query, "search", "solar products", "Pakistan"],
    };
}
