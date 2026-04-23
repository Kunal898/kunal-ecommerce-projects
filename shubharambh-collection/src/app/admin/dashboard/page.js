"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { getProducts } from "@/lib/productsStore";
import { getReels } from "@/lib/reelsStore";
import "./dashboard.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem("sc_admin");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
      setProducts(getProducts());
      setReels(getReels());
    }
  }, [router]);

  if (!isAuth) return null;

  const stats = [
    { label: "Products", value: products.length, icon: "📦", color: "#7B1E3A" },
    { label: "Reels", value: reels.length, icon: "🎬", color: "#D4A843" },
    { label: "Categories", value: CATEGORIES.length, icon: "📂", color: "#3ECFA0" },
    { label: "Active", value: products.filter((p) => p.isNew || p.isTrending).length, icon: "🔥", color: "#E8C673" },
  ];

  const menuItems = [
    { href: "/admin/products", label: "Manage Products", icon: "📦", desc: "Add, edit, delete products" },
    { href: "/admin/reels", label: "Manage Reels", icon: "🎬", desc: "Upload and manage video reels" },
    { href: "/admin/shop-assets", label: "Shop Assets", icon: "🖼️", desc: "Banners, gallery, logo" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("sc_admin");
    router.push("/admin/login");
  };

  return (
    <div className="admin-dash">
      {/* Header */}
      <div className="admin-dash__header">
        <div className="container">
          <div className="admin-dash__header-inner">
            <div>
              <h1 className="admin-dash__title font-display">
                Admin <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="admin-dash__sub">Shubharambh Collection — Management Panel</p>
            </div>
            <div className="admin-dash__header-actions">
              <Link href="/" className="btn btn-outline btn-sm">
                🌐 View Site
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-dash__body">
        {/* Stats */}
        <div className="admin-stats">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="admin-stat-card glass animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="admin-stat-card__icon">{stat.icon}</span>
              <div>
                <p className="admin-stat-card__value" style={{ color: stat.color }}>{stat.value}</p>
                <p className="admin-stat-card__label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="admin-dash__section-title">Quick Actions</h2>
        <div className="admin-menu">
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="admin-menu-card card animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="admin-menu-card__icon">{item.icon}</span>
              <h3 className="admin-menu-card__title">{item.label}</h3>
              <p className="admin-menu-card__desc">{item.desc}</p>
              <span className="admin-menu-card__arrow">→</span>
            </Link>
          ))}
        </div>

        {/* Recent Products */}
        <h2 className="admin-dash__section-title">Recent Products</h2>
        <div className="admin-table-wrap glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const cat = CATEGORIES.find((c) => c.id === product.category);
                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{cat?.name || product.category}</td>
                    <td className="text-gold">₹{product.price.toLocaleString("en-IN")}</td>
                    <td>
                      {product.isNew && <span className="badge badge-new">New</span>}
                      {product.isTrending && <span className="badge badge-trending">Trending</span>}
                      {!product.isNew && !product.isTrending && <span className="badge" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--clr-border)" }}>Active</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
