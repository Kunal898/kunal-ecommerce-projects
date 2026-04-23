"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES } from "@/lib/constants";
import { fetchProducts } from "@/lib/productsStore";
import ProductCard from "@/components/ProductCard";
import "./catalog.css";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setAllProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];

    // Category filter
    if (activeCategory !== "all") {
      items = items.filter((p) => p.category === activeCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        break;
    }

    return items;
  }, [activeCategory, sortBy, searchQuery, allProducts]);

  return (
    <div className="catalog-page">
      {/* Header */}
      <div className="catalog-header">
        <div className="container">
          <h1 className="catalog-title font-display">
            Our <span className="text-gradient">Collection</span>
          </h1>
          <p className="catalog-subtitle">
            Browse our exclusive range of handpicked sarees and ethnic wear.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="catalog-filters glass animate-fade-in-up">
          <div className="catalog-filters__section">
            <h3 className="filter-label">Categories</h3>
            <div className="cat-tags">
              <button
                className={`cat-tag ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All Pieces
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-tag ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-filters__sidebar">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                className="filter-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <p className="results-count">
          Showing {filteredProducts.length} of {allProducts.length} unique pieces
        </p>

        {/* Products Grid */}
        <div className="catalog-grid">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="product-skeleton glass animate-pulse" style={{ height: "400px", borderRadius: "20px" }}></div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
              />
            ))
          ) : (
            <div className="catalog-empty">
              <span className="catalog-empty__icon">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your search or browse a different category.</p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={<div className="loading-state">Loading Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
