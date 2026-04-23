// ═══════════════════════════════════════════════════════════════
// Products Store — Supabase Integration
// ═══════════════════════════════════════════════════════════════

import { supabase } from "./supabase";

/**
 * Fetch all products from Supabase
 */
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  // Transform to match local format if needed
  return data.map(p => ({
    ...p,
    id: p.id.toString(),
    category: p.category_id || "all", // Keep category if UUID or string
    image: p.image_url || "/images/products/banarasi.png",
    images: [p.image_url || "/images/products/banarasi.png"],
    isNew: p.is_new,
    isTrending: p.is_trending
  }));
}

/**
 * Add a new product to Supabase
 */
export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: product.name,
        price: product.price,
        category_id: product.category_id || null, // You'll need to map category names to UUIDs or just store as text
        description: product.description,
        sizes: product.sizes,
        image_url: product.image_url,
        is_new: product.isNew,
        is_trending: product.isTrending,
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Delete a product from Supabase
 */
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

// Fallback for sync components (TEMPORARY - will migrate all to fetch)
export function getProducts() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("sc_products");
  return data ? JSON.parse(data) : [];
}
