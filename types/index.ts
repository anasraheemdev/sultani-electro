export * from "./database";

// Common Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ProductWithDetails {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    sku: string;
    price: number;
    discounted_price: number | null;
    specifications: Record<string, any> | null;
    features: string[] | null;
    is_featured: boolean;
    is_active: boolean;
    view_count: number;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    brand: {
        id: string;
        name: string;
        logo_url: string | null;
    } | null;
    images: Array<{
        id: string;
        image_url: string;
        alt_text: string | null;
        display_order: number;
    }>;
    videos: Array<{
        id: string;
        video_url: string;
        thumbnail_url: string | null;
        title: string | null;
    }>;
    inventory: {
        quantity: number;
        low_stock_threshold: number;
    } | null;
    average_rating: number;
    review_count: number;
}

export interface CartItemWithProduct {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discounted_price: number | null;
        images: Array<{
            image_url: string;
            alt_text: string | null;
        }>;
        inventory: {
            quantity: number;
        } | null;
    };
}

export interface OrderWithDetails {
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    delivery_cost: number;
    discount_amount: number;
    total: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    created_at: string;
    updated_at: string;
    items: Array<{
        id: string;
        product_name: string;
        product_sku: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }>;
    delivery_address: {
        full_name: string;
        phone: string;
        address_line1: string;
        address_line2: string | null;
        city: string;
        state: string;
        postal_code: string;
    };
}

export interface ProductFilters {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: "price_asc" | "price_desc" | "newest" | "popular" | "name";
    inStock?: boolean;
}

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
    recentOrders: OrderWithDetails[];
    topProducts: Array<{
        product: ProductWithDetails;
        sales: number;
    }>;
    salesByDay: Array<{
        date: string;
        sales: number;
    }>;
}
