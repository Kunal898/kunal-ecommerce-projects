-- ═══════════════════════════════════════════════════════════════
-- Shubharambh Collection — Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- DROP existing tables (if re-running this script)
-- Remove these DROP lines if you have real data you want to keep
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS shop_assets CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- Create Tables
-- ═══════════════════════════════════════════════════════════════

-- ── Categories ──
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '📦',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Products ──
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  sizes TEXT[] DEFAULT '{"Free Size"}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Media (product images & videos / reels) ──
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'image')) NOT NULL,
  title TEXT,
  is_thumbnail BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Shop Assets (banners, gallery, logo) ──
CREATE TABLE shop_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('banner', 'gallery', 'logo', 'storefront')) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Admin Users ──
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Public read access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active products" ON products FOR SELECT USING (is_active = true);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active media" ON media FOR SELECT USING (is_active = true);

ALTER TABLE shop_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read shop_assets" ON shop_assets FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage categories" ON categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can manage products" ON products FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can manage media" ON media FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can manage shop_assets" ON shop_assets FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- ── Orders ──
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT,
  product_name TEXT NOT NULL,
  price INT,
  status TEXT DEFAULT 'pending',
  customer_details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read orders" ON orders FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- Seed Data
-- ═══════════════════════════════════════════════════════════════

-- Categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Silk Sarees', 'silk-sarees', '✨', 1),
  ('Designer Sarees', 'designer-sarees', '💎', 2),
  ('Wedding Collection', 'wedding-collection', '💍', 3),
  ('Ethnic Wear', 'ethnic-wear', '🪔', 4),
  ('Casual Wear', 'casual-wear', '🌸', 5),
  ('Men''s Collection', 'mens-collection', '👔', 6)
ON CONFLICT (slug) DO NOTHING;
