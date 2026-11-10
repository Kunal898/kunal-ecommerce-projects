// ═══════════════════════════════════════════════════════════════
// Products Store — Supabase Integration with Demo Fallback
// ═══════════════════════════════════════════════════════════════

import { supabase } from "./supabase";
import { DEMO_PRODUCTS } from "./constants";

/**
 * Fetch all products from Supabase (falls back to DEMO_PRODUCTS if empty/offline)
 */
export async function fetchProducts() {
  if (!supabase) {
    return DEMO_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("sc_products");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          } catch (e) {
            // ignore JSON error
          }
        }
      }
      return DEMO_PRODUCTS;
    }

    // Transform to match standard shape
    return data.map((p) => ({
      ...p,
      id: p.id.toString(),
      price: p.price,
      priceOnRequest: !p.price || p.price === 0,
      category: p.category_id || p.category || "silk-sarees",
      image: p.image_url || p.image || "/images/products/banarasi.png",
      images: p.images || [p.image_url || p.image || "/images/products/banarasi.png"],
      isNew: p.is_new ?? p.isNew ?? false,
      isTrending: p.is_trending ?? p.isTrending ?? false,
      occasion: p.occasion || "festive",
    }));
  } catch (err) {
    console.warn("fetchProducts error, falling back to DEMO_PRODUCTS:", err);
    return DEMO_PRODUCTS;
  }
}

/**
 * Add a new product to Supabase
 */
export async function addProduct(product) {
  if (!supabase) throw new Error("Database not connected");

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: product.name,
        price: product.price,
        category_id: product.category_id || product.category || null,
        description: product.description,
        sizes: product.sizes,
        image_url: product.image_url,
        is_new: product.isNew,
        is_trending: product.isTrending,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Delete a product from Supabase
 */
export async function deleteProduct(id) {
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Fallback for synchronous components
export function getProducts() {
  if (typeof window === "undefined") return DEMO_PRODUCTS;
  const data = localStorage.getItem("sc_products");
  return data ? JSON.parse(data) : DEMO_PRODUCTS;
}
