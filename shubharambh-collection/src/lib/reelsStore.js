// ═══════════════════════════════════════════════════════════════
// Reels Store — Supabase Integration
// ═══════════════════════════════════════════════════════════════

import { supabase } from "./supabase";
import { DEMO_REELS } from "./constants";

/**
 * Fetch all reels from Supabase
 */
export async function fetchReels() {
  if (!supabase) {
    return DEMO_REELS.map((r) => ({ ...r, isActive: true }));
  }

  try {
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

    if (error || !data || data.length === 0) {
      return DEMO_REELS.map((r) => ({ ...r, isActive: true }));
    }

    return data.map((r) => ({
      id: r.id,
      title: r.title,
      productId: r.products?.id,
      productName: r.products?.name || "Unknown Product",
      price: r.products?.price || 0,
      category: r.products?.category_id || "",
      videoUrl: r.url,
      thumbnailUrl: r.url.replace(/\.[^/.]+$/, ".jpg"),
      isActive: r.is_active,
      createdAt: r.created_at,
    }));
  } catch (err) {
    return DEMO_REELS.map((r) => ({ ...r, isActive: true }));
  }
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
  if (typeof window === "undefined") return DEMO_REELS.map((r) => ({ ...r, isActive: true }));
  const data = localStorage.getItem("sc_reels");
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return DEMO_REELS.map((r) => ({ ...r, isActive: true }));
}

export function saveReel(reel) {
  if (typeof window === "undefined") return;
  const reels = getReels();
  reels.unshift(reel);
  localStorage.setItem("sc_reels", JSON.stringify(reels));
  return reel;
}
