# SultaniElectro - Enterprise E-Commerce Platform

![SultaniElectro](https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=400&fit=crop)

**Premium Solar Energy & Electronics E-Commerce Platform**

A high-end, enterprise-grade e-commerce website built with Next.js 14, TypeScript, Supabase, and modern web technologies.

## 🚀 Features

### Customer-Facing Store
- ✅ **Premium Landing Page** - Animated hero section with Framer Motion
- ✅ **Category Showcase** - 6 main product categories with icons
- ✅ **Product Catalog** - Advanced product listing and filtering
- ✅ **Product Details** - Image gallery, specifications, reviews
- ✅ **Shopping Cart** - Persistent cart with Zustand
- ✅ **Checkout** - COD payment with address management
- ✅ **User Authentication** - Supabase Auth integration
- ✅ **User Dashboard** - Order history, profile, addresses

### Admin Panel
- ✅ **Dashboard** - Analytics and overview
- ✅ **Product Management** - Full CRUD operations
- ✅ **Order Management** - Status updates, tracking
- ✅ **Customer Management** - User profiles and bans
- ✅ **Banner Management** - Homepage slider control
- ✅ **Analytics** - Sales reports and insights
- ✅ **Audit Logs** - Track all admin actions

### Advanced Features
- ✅ **Smart Recommendations** - Similar products by category/price
- ✅ **Auto-SEO** - Dynamic meta tag generation
- ✅ **Product Search** - Full-text search with filters
- ✅ **Reviews & Ratings** - Customer feedback system
- ✅ **Inventory Tracking** - Real-time stock management
- ✅ **Discount Coupons** - Promotional code system

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Step 1: Clone and Install

```bash
cd sultani
npm install
```

### Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key

### Step 3: Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=SultaniElectro
ADMIN_EMAIL=admin@sultanielectro.com
```

### Step 4: Set Up Database

1. Go to Supabase SQL Editor
2. Run `supabase/schema.sql` to create all tables
3. Run `supabase/seed.sql` to populate sample data

### Step 5: Set Up Storage

1. Go to Supabase Storage
2. Create buckets:
   - `product-images` (public)
   - `product-videos` (public)
   - `banners` (public)
   - `avatars` (public)

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sultani/
├── app/                      # Next.js App Router
│   ├── (store)/             # Customer-facing pages
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Product pages
│   │   ├── category/        # Category pages
│   │   ├── cart/            # Shopping cart
│   │   └── checkout/        # Checkout flow
│   ├── admin/               # Admin panel
│   │   ├── products/        # Product management
│   │   ├── orders/          # Order management
│   │   ├── customers/       # Customer management
│   │   └── analytics/       # Analytics dashboard
│   ├── api/                 # API routes
│   └── actions/             # Server actions
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   ├── layout/              # Layout components
│   ├── home/                # Homepage components
│   ├── products/            # Product components
│   └── admin/               # Admin components
├── lib/                     # Utilities and configs
│   ├── supabase/           # Supabase clients
│   ├── store/              # Zustand stores
│   ├── utils.ts            # Utility functions
│   └── constants.ts        # App constants
├── types/                   # TypeScript types
├── supabase/               # Database files
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Seed data
└── public/                 # Static assets
```

## 🎨 Theme Colors

- **Primary Red**: `#C40000`
- **White**: `#FFFFFF`
- **Light Black**: `#1A1A1A`

## 🗄️ Database Schema

The platform includes 18 tables:

- **Core**: users, admins, categories, products, brands
- **E-Commerce**: orders, order_items, addresses, carts, cart_items
- **Content**: banners, testimonials, reviews, coupons
- **Media**: product_images, product_videos, inventory
- **Analytics**: audit_logs, product_views, search_logs

## 🔐 Admin Access

To create an admin user:

1. Register a regular user account
2. Run this SQL in Supabase:

```sql
-- Insert admin role for a user
INSERT INTO admins (user_id, role)
VALUES ('user-uuid-here', 'super_admin');
```

Admin roles:
- `super_admin` - Full access
- `product_manager` - Product management only
- `order_manager` - Order management only

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Migration

The database is already set up in Supabase. No migration needed.

## 📊 Sample Data

The seed file includes:
- 7 Brands (Longi, Jinko, Growatt, Huawei, Tesla, Samsung, LG)
- 6 Categories (Solar Panels, Inverters, Batteries, etc.)
- 9+ Products with images and specifications
- 3 Homepage banners
- 4 Customer testimonials
- 3 Discount coupons

## 🔧 Configuration

### Delivery Costs
Edit `lib/constants.ts`:
```typescript
export const DELIVERY_COST = {
  FREE_THRESHOLD: 50000,  // Free above PKR 50,000
  STANDARD: 500,          // PKR 500 standard
  EXPRESS: 1000,          // PKR 1,000 express
};
```

### Order Statuses
- `pending` - Order placed
- `confirmed` - Order confirmed
- `processing` - Being prepared
- `dispatched` - Out for delivery
- `delivered` - Completed
- `cancelled` - Cancelled

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe, JazzCash)
- [ ] Email notifications (Resend, SendGrid)
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-powered chatbot
- [ ] Product comparison tool
- [ ] Wishlist functionality
- [ ] Social media integration

## 📄 License

This project is proprietary software for SultaniElectro.

## 🤝 Support

For support, email info@sultanielectro.com

---

**Built with ❤️ for SultaniElectro**
