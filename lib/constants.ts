// Application Constants
export const APP_NAME = "SultaniElectro";
export const APP_DESCRIPTION =
    "Premium Solar Energy & Electronics - Your trusted partner for sustainable energy solutions";

// Theme Colors
export const COLORS = {
    PRIMARY: "#4DC9C9", // Turquoise
    SECONDARY: "#E67E50", // Warm Orange
    ACCENT: "#F5B8C5", // Coral Pink
    WHITE: "#FFFFFF",
    DARK: "#262626",
} as const;

// Delivery Configuration
export const DELIVERY_COST = {
    FREE_THRESHOLD: 50000, // Free delivery above PKR 50,000
    STANDARD: 500, // PKR 500 for orders below threshold
    EXPRESS: 1000, // PKR 1,000 for express delivery
} as const;

// Order Status
export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    DISPATCHED: "dispatched",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const;

// Admin Roles
export const ADMIN_ROLES = {
    SUPER_ADMIN: "super_admin",
    PRODUCT_MANAGER: "product_manager",
    ORDER_MANAGER: "order_manager",
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;

// Product Categories
export const PRODUCT_CATEGORIES = [
    "Solar Panels",
    "Inverters",
    "Batteries",
    "Solar Accessories",
    "Electronics",
    "Home Appliances",
] as const;

// Image Placeholders
export const PLACEHOLDER_IMAGES = {
    PRODUCT: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    BANNER: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200",
    CATEGORY: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600",
    USER: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200",
} as const;

// SEO Defaults
export const SEO_DEFAULTS = {
    TITLE_TEMPLATE: `%s | ${APP_NAME}`,
    DEFAULT_TITLE: `${APP_NAME} - Premium Solar Energy & Electronics`,
    DESCRIPTION: APP_DESCRIPTION,
    KEYWORDS: [
        "solar panels",
        "solar energy",
        "inverters",
        "batteries",
        "electronics",
        "Pakistan",
        "renewable energy",
    ],
} as const;
