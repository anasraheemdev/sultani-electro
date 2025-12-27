-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT DEFAULT 'SultaniElectro',
    store_tagline TEXT DEFAULT 'Pakistan''s #1 Solar Energy Provider',
    store_email TEXT DEFAULT 'info@sultanielectro.pk',
    store_phone TEXT DEFAULT '+92 300 1234567',
    store_address TEXT DEFAULT 'Main Boulevard, Gulberg III',
    store_city TEXT DEFAULT 'Lahore',
    store_country TEXT DEFAULT 'Pakistan',
    currency TEXT DEFAULT 'PKR',
    currency_symbol TEXT DEFAULT '₨',
    facebook_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    twitter_url TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '',
    free_shipping_threshold INTEGER DEFAULT 50000,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    enable_reviews BOOLEAN DEFAULT true,
    enable_wishlist BOOLEAN DEFAULT true,
    enable_coupons BOOLEAN DEFAULT true,
    maintenance_mode BOOLEAN DEFAULT false,
    meta_title TEXT DEFAULT 'SultaniElectro - Premium Solar Energy Solutions',
    meta_description TEXT DEFAULT 'Pakistan''s leading solar energy provider. Premium solar panels, inverters, and batteries.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if table is empty
INSERT INTO store_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM store_settings);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for admin service role)
CREATE POLICY "Allow all for service role" ON store_settings
    FOR ALL USING (true);
