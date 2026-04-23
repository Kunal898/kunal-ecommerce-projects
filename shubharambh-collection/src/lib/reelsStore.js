// ═══════════════════════════════════════════════════════════════
// Reels Store — Supabase Integration
// ═══════════════════════════════════════════════════════════════

import { supabase } from "./supabase";

/**
 * Fetch all reels from Supabase
 */
export async function fetchReels() {
  const { data, error } = await supabase
    .from("media")
    .select(`
      *,
      products (
        id,
        name,
        price,
        category_id
      )
    `)
    .eq("type", "video")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reels:", error);
    return [];
  }

  return data.map((r) => ({
    id: r.id,
    title: r.title,
    productId: r.products?.id,
    productName: r.products?.name || "Unknown Product",
    price: r.products?.price || 0,
    category: r.products?.category_id || "",
    videoUrl: r.url,
    thumbnailUrl: r.url.replace(/\.[^/.]+$/, ".jpg"), // Fallback logic or store thumbnail in col
    isActive: r.is_active,
    createdAt: r.created_at
  }));
}

/**
 * Delete a reel
 */
export async function deleteReel(id) {
  const { error } = await supabase
    .from("media")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

/**
 * Toggle status
 */
export async function toggleReelActive(id, currentState) {
  const { error } = await supabase
    .from("media")
    .update({ is_active: !currentState })
    .eq("id", id);
  if (error) throw error;
}

// Fallback for sync
export function getReels() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("sc_reels");
  return data ? JSON.parse(data) : [];
}

export function saveReel(reel) {
  if (typeof window === "undefined") return;
  const reels = getReels();
  reels.unshift(reel);
  localStorage.setItem("sc_reels", JSON.stringify(reels));
  return reel;
}
