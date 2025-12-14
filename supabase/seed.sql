-- SultaniElectro Seed Data
-- Run this after schema.sql to populate the database with sample data

-- ============================================================================
-- BRANDS
-- ============================================================================

INSERT INTO brands (name, slug, description, is_active) VALUES
('Longi Solar', 'longi-solar', 'World-leading solar panel manufacturer', TRUE),
('Jinko Solar', 'jinko-solar', 'Premium solar panels and modules', TRUE),
('Growatt', 'growatt', 'Advanced solar inverters and energy storage', TRUE),
('Huawei', 'huawei', 'Smart energy solutions', TRUE),
('Tesla', 'tesla', 'Energy storage and solar solutions', TRUE),
('Samsung', 'samsung', 'Electronics and home appliances', TRUE),
('LG', 'lg', 'Premium electronics', TRUE);

-- ============================================================================
-- CATEGORIES
-- ============================================================================

INSERT INTO categories (name, slug, description, icon, display_order, is_active) VALUES
('Solar Panels', 'solar-panels', 'High-efficiency solar panels for residential and commercial use', '☀️', 1, TRUE),
('Inverters', 'inverters', 'Solar inverters and power conversion systems', '⚡', 2, TRUE),
('Batteries', 'batteries', 'Energy storage solutions and backup power', '🔋', 3, TRUE),
('Solar Accessories', 'solar-accessories', 'Mounting systems, cables, and connectors', '🔧', 4, TRUE),
('Electronics', 'electronics', 'Consumer electronics and gadgets', '📱', 5, TRUE),
('Home Appliances', 'home-appliances', 'Energy-efficient home appliances', '🏠', 6, TRUE);

-- ============================================================================
-- PRODUCTS
-- ============================================================================

-- Solar Panels
INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, discounted_price, specifications, features, is_featured, is_active, meta_title, meta_description)
SELECT 
  'Longi Hi-MO 5 550W Solar Panel',
  'longi-hi-mo-5-550w',
  'The Longi Hi-MO 5 is a high-efficiency monocrystalline solar panel featuring advanced PERC technology. With 550W power output and exceptional low-light performance, this panel is perfect for both residential and commercial installations. Built to withstand harsh weather conditions with a robust aluminum frame and tempered glass.',
  'High-efficiency 550W monocrystalline solar panel with PERC technology',
  'SE-LONGI-550W-001',
  c.id,
  b.id,
  85000.00,
  79900.00,
  '{"power": "550W", "efficiency": "21.3%", "voltage": "41.7V", "current": "13.2A", "dimensions": "2278x1134x35mm", "weight": "27.5kg", "warranty": "25 years"}'::jsonb,
  ARRAY['25-year performance warranty', 'PERC technology', 'Anti-PID performance', 'Low degradation rate', 'Excellent low-light performance'],
  TRUE,
  TRUE,
  'Longi Hi-MO 5 550W Solar Panel - Premium Quality',
  'Buy Longi Hi-MO 5 550W solar panel in Pakistan. High efficiency, 25-year warranty, best price guaranteed.'
FROM categories c, brands b
WHERE c.slug = 'solar-panels' AND b.slug = 'longi-solar';

INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, discounted_price, specifications, features, is_featured, is_active)
SELECT 
  'Jinko Tiger Pro 580W Solar Panel',
  'jinko-tiger-pro-580w',
  'Jinko Tiger Pro series delivers exceptional performance with 580W output. Features innovative Tiling Ribbon technology for better light capture and reduced internal resistance. Ideal for large-scale solar installations.',
  '580W high-power solar panel with Tiling Ribbon technology',
  'SE-JINKO-580W-001',
  c.id,
  b.id,
  92000.00,
  NULL,
  '{"power": "580W", "efficiency": "22.1%", "voltage": "42.8V", "current": "13.56A", "dimensions": "2384x1134x35mm", "weight": "29.5kg", "warranty": "25 years"}'::jsonb,
  ARRAY['Tiling Ribbon technology', '25-year warranty', 'Better low-light performance', 'Reduced hot-spot risk'],
  TRUE,
  TRUE
FROM categories c, brands b
WHERE c.slug = 'solar-panels' AND b.slug = 'jinko-solar';

-- Inverters
INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, discounted_price, specifications, features, is_featured, is_active)
SELECT 
  'Growatt 10KW On-Grid Inverter',
  'growatt-10kw-on-grid',
  'Growatt 10KW on-grid solar inverter with dual MPPT trackers for maximum energy harvest. Features WiFi monitoring, smart grid support, and excellent efficiency. Perfect for residential and small commercial installations.',
  '10KW on-grid inverter with dual MPPT and WiFi monitoring',
  'SE-GROW-10KW-001',
  c.id,
  b.id,
  145000.00,
  135000.00,
  '{"power": "10000W", "efficiency": "98.4%", "mppt": "2", "input_voltage": "200-1000V", "output_voltage": "220/380V", "dimensions": "470x445x195mm", "weight": "22kg", "warranty": "10 years"}'::jsonb,
  ARRAY['Dual MPPT trackers', 'WiFi monitoring', '98.4% efficiency', 'IP65 protection', '10-year warranty'],
  TRUE,
  TRUE
FROM categories c, brands b
WHERE c.slug = 'inverters' AND b.slug = 'growatt';

INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, discounted_price, specifications, features, is_featured, is_active)
SELECT 
  'Huawei SUN2000-8KTL Hybrid Inverter',
  'huawei-sun2000-8ktl',
  'Huawei SUN2000 hybrid inverter combines solar and battery storage in one unit. Smart energy management, AI-powered optimization, and seamless backup power switching.',
  '8KW hybrid inverter with battery storage support',
  'SE-HUAW-8KW-001',
  c.id,
  b.id,
  185000.00,
  175000.00,
  '{"power": "8000W", "efficiency": "98.6%", "battery_voltage": "90-560V", "input_voltage": "200-1000V", "output_voltage": "220/380V", "dimensions": "490x425x175mm", "weight": "18kg", "warranty": "10 years"}'::jsonb,
  ARRAY['Hybrid functionality', 'Battery ready', 'AI optimization', 'Smart grid support', 'Remote monitoring'],
  TRUE,
  TRUE
FROM categories c, brands b
WHERE c.slug = 'inverters' AND b.slug = 'huawei';

-- Batteries
INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, discounted_price, specifications, features, is_featured, is_active)
SELECT 
  'Tesla Powerwall 2 13.5kWh',
  'tesla-powerwall-2',
  'Tesla Powerwall 2 is a rechargeable lithium-ion battery designed to store energy from solar panels. Provides backup power during outages and helps reduce electricity costs.',
  '13.5kWh home battery storage system',
  'SE-TESL-PW2-001',
  c.id,
  b.id,
  950000.00,
  920000.00,
  '{"capacity": "13.5kWh", "power": "5kW continuous", "voltage": "350-450V", "efficiency": "90%", "dimensions": "1150x755x155mm", "weight": "114kg", "warranty": "10 years"}'::jsonb,
  ARRAY['13.5kWh capacity', 'Seamless backup', 'Mobile app control', '10-year warranty', 'Scalable system'],
  TRUE,
  TRUE
FROM categories c, brands b
WHERE c.slug = 'batteries' AND b.slug = 'tesla';

-- Solar Accessories
INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, specifications, features, is_active)
SELECT 
  'Solar Panel Mounting Kit - Roof Mount',
  'solar-panel-mounting-kit',
  'Complete mounting kit for rooftop solar panel installation. Includes aluminum rails, clamps, bolts, and all necessary hardware. Suitable for tile and metal roofs.',
  'Complete rooftop mounting solution for solar panels',
  'SE-MOUNT-KIT-001',
  c.id,
  NULL,
  12000.00,
  '{"material": "Aluminum alloy", "capacity": "Up to 10 panels", "roof_type": "Tile/Metal", "warranty": "10 years"}'::jsonb,
  ARRAY['Corrosion resistant', 'Easy installation', 'Adjustable angle', 'All hardware included'],
  TRUE
FROM categories c
WHERE c.slug = 'solar-accessories';

INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, specifications, features, is_active)
SELECT 
  'MC4 Solar Cable Connectors - 10 Pairs',
  'mc4-solar-connectors',
  'High-quality MC4 connectors for solar panel wiring. IP67 waterproof rating, UV resistant, and rated for 30A current.',
  'Premium MC4 connectors for solar installations',
  'SE-MC4-CONN-001',
  c.id,
  NULL,
  2500.00,
  '{"rating": "30A/1000V", "protection": "IP67", "temperature": "-40°C to +90°C", "quantity": "10 pairs"}'::jsonb,
  ARRAY['IP67 waterproof', 'UV resistant', 'Easy to install', 'TUV certified'],
  TRUE
FROM categories c
WHERE c.slug = 'solar-accessories';

-- Electronics
INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, discounted_price, specifications, features, is_featured, is_active, meta_title, meta_description)
SELECT 
  'Samsung 55" 4K Smart TV',
  'samsung-55-4k-smart-tv',
  'Samsung 55-inch 4K UHD Smart TV with Crystal Processor 4K, HDR support, and Tizen OS. Energy-efficient display perfect for solar-powered homes.',
  '55" 4K Smart TV with energy-efficient display',
  'SE-SAMS-TV55-001',
  c.id,
  b.id,
  125000.00,
  115000.00,
  '{"screen_size": "55 inches", "resolution": "3840x2160", "refresh_rate": "60Hz", "smart_os": "Tizen", "power": "120W", "warranty": "2 years"}'::jsonb,
  ARRAY['4K UHD resolution', 'Smart TV features', 'Energy efficient', 'HDR support'],
  FALSE,
  TRUE,
  'Samsung 55" 4K Smart TV - Energy Efficient',
  'Buy Samsung 55" 4K Smart TV in Pakistan. Energy-efficient display, perfect for solar homes.'
FROM categories c, brands b
WHERE c.slug = 'electronics' AND b.slug = 'samsung';

-- Home Appliances
INSERT INTO products (name, slug, description, short_description, sku, category_id, brand_id, price, specifications, features, is_active)
SELECT 
  'LG Inverter AC 1.5 Ton',
  'lg-inverter-ac-1-5-ton',
  'LG 1.5 ton inverter air conditioner with energy-saving technology. Ideal for solar-powered homes with low power consumption.',
  'Energy-efficient 1.5 ton inverter AC',
  'SE-LG-AC15-001',
  c.id,
  b.id,
  89000.00,
  '{"capacity": "1.5 ton", "type": "Inverter", "cooling_power": "5200W", "power_consumption": "1450W", "energy_rating": "A++", "warranty": "2 years"}'::jsonb,
  ARRAY['Inverter technology', 'Energy efficient', 'Low noise', 'Fast cooling'],
  TRUE
FROM categories c, brands b
WHERE c.slug = 'home-appliances' AND b.slug = 'lg';

-- ============================================================================
-- PRODUCT IMAGES
-- ============================================================================

-- Add images for products (using Unsplash placeholders)
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', 'Longi Solar Panel Front View', 0
FROM products p WHERE p.slug = 'longi-hi-mo-5-550w';

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', 'Longi Solar Panel Detail', 1
FROM products p WHERE p.slug = 'longi-hi-mo-5-550w';

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', 'Jinko Solar Panel', 0
FROM products p WHERE p.slug = 'jinko-tiger-pro-580w';

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', 'Solar Inverter', 0
FROM products p WHERE p.slug = 'growatt-10kw-on-grid';

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', 'Huawei Inverter', 0
FROM products p WHERE p.slug = 'huawei-sun2000-8ktl';

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT p.id, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800', 'Tesla Powerwall', 0
FROM products p WHERE p.slug = 'tesla-powerwall-2';

-- ============================================================================
-- INVENTORY
-- ============================================================================

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 50, 10 FROM products WHERE slug = 'longi-hi-mo-5-550w';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 35, 10 FROM products WHERE slug = 'jinko-tiger-pro-580w';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 25, 5 FROM products WHERE slug = 'growatt-10kw-on-grid';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 15, 5 FROM products WHERE slug = 'huawei-sun2000-8ktl';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 8, 3 FROM products WHERE slug = 'tesla-powerwall-2';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 100, 20 FROM products WHERE slug = 'solar-panel-mounting-kit';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 200, 50 FROM products WHERE slug = 'mc4-solar-connectors';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 30, 10 FROM products WHERE slug = 'samsung-55-4k-smart-tv';

INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 20, 5 FROM products WHERE slug = 'lg-inverter-ac-1-5-ton';

-- ============================================================================
-- BANNERS
-- ============================================================================

INSERT INTO banners (title, subtitle, image_url, link_url, button_text, display_order, is_active) VALUES
('Power Your Future with Solar', 'Premium solar panels starting from PKR 79,900', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200', '/category/solar-panels', 'Shop Now', 1, TRUE),
('Smart Energy Solutions', 'Advanced inverters and battery storage systems', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200', '/category/inverters', 'Explore', 2, TRUE),
('Go Green, Save More', 'Up to 25% off on selected solar products', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200', '/products', 'View Deals', 3, TRUE);

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================

INSERT INTO testimonials (customer_name, customer_title, rating, comment, is_active, display_order) VALUES
('Ahmed Khan', 'Homeowner, Lahore', 5, 'Installed a 10KW solar system from SultaniElectro. Excellent quality products and professional installation. My electricity bills have dropped by 80%!', TRUE, 1),
('Fatima Ali', 'Business Owner, Karachi', 5, 'Best solar energy company in Pakistan. The team is knowledgeable and the after-sales support is outstanding. Highly recommended!', TRUE, 2),
('Hassan Raza', 'Engineer, Islamabad', 5, 'Purchased Longi solar panels and Growatt inverter. Top-notch quality at competitive prices. Very satisfied with my investment.', TRUE, 3),
('Ayesha Malik', 'Homeowner, Faisalabad', 4, 'Great experience shopping at SultaniElectro. Fast delivery and genuine products. The solar system is working perfectly.', TRUE, 4);

-- ============================================================================
-- COUPONS
-- ============================================================================

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active) VALUES
('SOLAR2024', 'New Year Solar Sale - 10% off', 'percentage', 10, 50000, TRUE),
('FIRST5000', 'First order discount - PKR 5000 off', 'fixed', 5000, 100000, TRUE),
('SUMMER15', 'Summer special - 15% off on all products', 'percentage', 15, 75000, TRUE);
