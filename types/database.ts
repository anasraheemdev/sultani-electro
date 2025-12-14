// Database Types
export interface Database {
    public: {
        Tables: {
            users: User;
            admins: Admin;
            categories: Category;
            products: Product;
            product_images: ProductImage;
            product_videos: ProductVideo;
            inventory: Inventory;
            orders: Order;
            order_items: OrderItem;
            addresses: Address;
            carts: Cart;
            cart_items: CartItem;
            banners: Banner;
            reviews: Review;
            coupons: Coupon;
            brands: Brand;
            testimonials: Testimonial;
            audit_logs: AuditLog;
            product_views: ProductView;
            search_logs: SearchLog;
        };
    };
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    is_banned: boolean;
    created_at: string;
    updated_at: string;
}

export interface Admin {
    id: string;
    user_id: string;
    role: "super_admin" | "product_manager" | "order_manager";
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    image_url: string | null;
    parent_id: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    sku: string;
    category_id: string;
    brand_id: string | null;
    price: number;
    discounted_price: number | null;
    specifications: Record<string, any> | null;
    features: string[] | null;
    is_featured: boolean;
    is_active: boolean;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string[] | null;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    created_at: string;
}

export interface ProductVideo {
    id: string;
    product_id: string;
    video_url: string;
    thumbnail_url: string | null;
    title: string | null;
    created_at: string;
}

export interface Inventory {
    id: string;
    product_id: string;
    quantity: number;
    low_stock_threshold: number;
    updated_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    order_number: string;
    status: "pending" | "confirmed" | "processing" | "dispatched" | "delivered" | "cancelled";
    subtotal: number;
    delivery_cost: number;
    discount_amount: number;
    total: number;
    coupon_code: string | null;
    delivery_address_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    notes: string | null;
    admin_notes: string | null;
    delivery_person: string | null;
    tracking_number: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
}

export interface Address {
    id: string;
    user_id: string;
    label: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface Cart {
    id: string;
    user_id: string | null;
    session_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    button_text: string | null;
    display_order: number;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    title: string | null;
    comment: string;
    is_verified_purchase: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
}

export interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_order_amount: number | null;
    max_discount_amount: number | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Testimonial {
    id: string;
    customer_name: string;
    customer_title: string | null;
    avatar_url: string | null;
    rating: number;
    comment: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
}

export interface AuditLog {
    id: string;
    admin_id: string;
    action: string;
    entity_type: string;
    entity_id: string | null;
    changes: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
}

export interface ProductView {
    id: string;
    product_id: string;
    user_id: string | null;
    session_id: string | null;
    created_at: string;
}

export interface SearchLog {
    id: string;
    query: string;
    user_id: string | null;
    results_count: number;
    created_at: string;
}
