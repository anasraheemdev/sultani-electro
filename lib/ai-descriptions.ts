interface ProductData {
    name: string;
    category: string;
    brand?: string;
    specifications?: Record<string, any>;
    features?: string[];
}

const DESCRIPTION_TEMPLATES = {
    solar_panel: (data: ProductData) => `
Experience premium solar energy with the ${data.name}. ${data.brand ? `Manufactured by ${data.brand}, ` : ""}this high-efficiency solar panel is designed to deliver exceptional performance and reliability for your energy needs.

**Key Features:**
${data.features?.map((f) => `• ${f}`).join("\n") || "• High conversion efficiency\n• Weather-resistant design\n• Long-lasting durability"}

**Technical Excellence:**
Built with cutting-edge technology, this solar panel offers superior energy conversion and is engineered to withstand Pakistan's diverse climate conditions. Perfect for residential and commercial installations.

**Why Choose This Panel:**
✓ Premium quality components
✓ Excellent performance in low-light conditions
✓ Comprehensive warranty coverage
✓ Easy installation and maintenance

Invest in sustainable energy with confidence. Order now and start saving on your electricity bills while contributing to a greener Pakistan.
    `.trim(),

    inverter: (data: ProductData) => `
Power your home or business efficiently with the ${data.name}. ${data.brand ? `From ${data.brand}, ` : ""}this advanced inverter delivers reliable power conversion with intelligent features for optimal performance.

**Key Features:**
${data.features?.map((f) => `• ${f}`).join("\n") || "• Pure sine wave output\n• Overload protection\n• LCD display"}

**Smart Technology:**
Equipped with advanced circuitry and protection systems, this inverter ensures safe and efficient power delivery. Compatible with various battery types and solar panel configurations.

**Benefits:**
✓ Stable power output
✓ Low maintenance requirements
✓ Energy-efficient operation
✓ Quiet operation

Get uninterrupted power supply with this premium inverter. Perfect for homes, offices, and commercial applications across Pakistan.
    `.trim(),

    battery: (data: ProductData) => `
Store solar energy efficiently with the ${data.name}. ${data.brand ? `Manufactured by ${data.brand}, ` : ""}this high-capacity battery is designed for long-lasting performance and reliable energy storage.

**Key Features:**
${data.features?.map((f) => `• ${f}`).join("\n") || "• Deep cycle design\n• Maintenance-free operation\n• Long service life"}

**Reliable Energy Storage:**
Engineered for solar applications, this battery provides consistent power delivery and excellent charge retention. Built to handle frequent charge-discharge cycles.

**Advantages:**
✓ Extended lifespan
✓ Low self-discharge rate
✓ Temperature resistant
✓ Eco-friendly design

Ensure continuous power availability with this premium battery solution. Ideal for backup power and off-grid solar systems.
    `.trim(),

    default: (data: ProductData) => `
Discover the ${data.name} - a premium ${data.category.toLowerCase()} solution designed for excellence. ${data.brand ? `From the trusted brand ${data.brand}, ` : ""}this product combines quality, performance, and value.

**Product Highlights:**
${data.features?.map((f) => `• ${f}`).join("\n") || "• Premium quality construction\n• Reliable performance\n• Easy to use"}

**Why Choose This Product:**
✓ High-quality materials
✓ Proven reliability
✓ Excellent value for money
✓ Comprehensive support

Order now and experience the difference. Fast delivery available across Pakistan.
    `.trim(),
};

export function generateProductDescription(data: ProductData): string {
    const categoryKey = data.category.toLowerCase().replace(/\s+/g, "_");
    const template =
        DESCRIPTION_TEMPLATES[categoryKey as keyof typeof DESCRIPTION_TEMPLATES] ||
        DESCRIPTION_TEMPLATES.default;

    return template(data);
}

export function generateShortDescription(data: ProductData): string {
    const specs = data.specifications
        ? Object.entries(data.specifications)
            .slice(0, 3)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" | ")
        : "";

    return `${data.name} - Premium ${data.category.toLowerCase()} ${data.brand ? `by ${data.brand}` : ""
        }. ${specs}`.trim();
}

export function generateProductFeatures(category: string): string[] {
    const featuresByCategory: Record<string, string[]> = {
        solar_panel: [
            "High conversion efficiency",
            "Weather-resistant design",
            "25-year performance warranty",
            "Anti-reflective coating",
            "Corrosion-resistant frame",
        ],
        inverter: [
            "Pure sine wave output",
            "Overload protection",
            "LCD display with monitoring",
            "Multiple safety features",
            "Low power consumption",
        ],
        battery: [
            "Deep cycle design",
            "Maintenance-free operation",
            "Long service life",
            "Low self-discharge",
            "Temperature resistant",
        ],
    };

    return (
        featuresByCategory[category.toLowerCase().replace(/\s+/g, "_")] || [
            "Premium quality",
            "Reliable performance",
            "Easy installation",
            "Comprehensive warranty",
        ]
    );
}
