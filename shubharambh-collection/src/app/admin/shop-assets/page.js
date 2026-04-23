"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../dashboard/dashboard.css";

const SHOP_ASSETS = [
  { id: "1", type: "banner", label: "Hero Banner", image: "/images/shop/storefront.png" },
  { id: "2", type: "gallery", label: "Interior Gallery", image: "/images/shop/interior.png" },
  { id: "3", type: "logo", label: "Brand Logo", image: "/images/shop/logo.png" },
];

export default function AdminShopAssetsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("sc_admin");
    if (!auth) router.push("/admin/login");
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  return (
    <div className="admin-dash">
      <div className="admin-dash__header">
        <div className="container">
          <div className="admin-dash__header-inner">
            <div>
              <h1 className="admin-dash__title font-display">
                Shop <span className="text-gradient">Assets</span>
              </h1>
              <p className="admin-dash__sub">Manage banners, gallery photos, and logo</p>
            </div>
            <div className="admin-dash__header-actions">
              <Link href="/admin/dashboard" className="btn btn-ghost btn-sm">← Dashboard</Link>
              <button className="btn btn-accent btn-sm">+ Upload Asset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-dash__body">
        {/* Upload area */}
        <div className="glass animate-fade-in-up" style={{
          padding: "40px", borderRadius: "16px", marginBottom: "32px",
          border: "2px dashed var(--clr-border-strong)", textAlign: "center",
          cursor: "pointer", transition: "all 0.3s ease"
        }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>📸</span>
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            Drop files here or click to upload
          </h3>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "0.85rem" }}>
            Supports PNG, JPG, WEBP — Max 5MB each
          </p>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "0.75rem", marginTop: "8px" }}>
            ⚠️ In production, files upload to Supabase Storage.
          </p>
        </div>

        {/* Current Assets */}
        <h2 className="admin-dash__section-title">Current Assets</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {SHOP_ASSETS.map((asset, i) => (
            <div
              key={asset.id}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
                <Image
                  src={asset.image}
                  alt={asset.label}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <span className="badge badge-trending" style={{ position: "absolute", top: "8px", left: "8px" }}>
                  {asset.type}
                </span>
              </div>
              <div style={{ padding: "16px" }}>
                <p style={{ fontWeight: 700, marginBottom: "4px" }}>{asset.label}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>Type: {asset.type}</p>
                <div style={{ display: "flex", gap: "4px", marginTop: "12px" }}>
                  <button className="btn btn-outline btn-sm" style={{ fontSize: "0.75rem" }}>🔄 Replace</button>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem", color: "#ef4444" }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
