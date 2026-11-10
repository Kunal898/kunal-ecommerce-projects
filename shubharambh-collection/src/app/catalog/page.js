"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { PRICE_RANGES, OCCASIONS } from "@/lib/siteContent";
import { fetchProducts } from "@/lib/productsStore";
import ProductCard from "@/components/ProductCard";
import "./catalog.css";

function CatalogSkeletonGrid() {
  return (
    <div className="catalog-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="catalog-skeleton card">
          <div className="catalog-skeleton__image" />
          <div className="catalog-skeleton__body">
            <div className="catalog-skeleton__line catalog-skeleton__line--title" />
            <div className="catalog-skeleton__line catalog-skeleton__line--price" />
            <div className="catalog-skeleton__line catalog-skeleton__line--btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [activeOccasion, setActiveOccasion] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];

    // Category filter
    if (activeCategory !== "all") {
      items = items.filter((p) => p.category === activeCategory);
    }

    // Occasion filter
    if (activeOccasion !== "all") {
      const occKey = activeOccasion.toLowerCase();
      items = items.filter((p) => {
        if (p.occasion && p.occasion.toLowerCase() === occKey) return true;
        const text = `${p.name} ${p.description || ""} ${p.category || ""}`.toLowerCase();
        if (occKey === "wedding") return text.includes("wedding") || text.includes("bridal") || text.includes("lehenga");
        if (occKey === "festive") return text.includes("festive") || text.includes("paithani") || text.includes("banarasi") || text.includes("zari");
        if (occKey === "party") return text.includes("designer") || text.includes("sequin") || text.includes("party");
        if (occKey === "casual" || occKey === "daily") return text.includes("casual") || text.includes("cotton") || text.includes("kurta") || text.includes("daily");
        return text.includes(occKey);
      });
    }

    // Price range filter
    if (priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.id === priceRange);
      if (range) {
        items = items.filter((p) => {
          const price = Number(p.price) || 0;
          return price >= range.min && price < range.max;
        });
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price-high":
        items.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "newest":
      default:
        break;
    }

    return items;
  }, [activeCategory, activeOccasion, priceRange, sortBy, searchQuery, allProducts]);

  const clearAllFilters = () => {
    setActiveCategory("all");
    setActiveOccasion("all");
    setPriceRange("all");
    setSearchQuery("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeOccasion !== "all" ||
    priceRange !== "all" ||
    searchQuery.trim() !== "";

  return (
    <div className="catalog-page">
      {/* Header with SEO-rich title */}
      <div className="catalog-header">
        <div className="container">
          <h1 className="catalog-title font-display">
            Banarasi &amp; Silk Sarees <span className="text-gradient">Catalog</span>
          </h1>
          <p className="catalog-subtitle">
            Explore authentic Banarasi, Paithani, Kanjivaram sarees and bridal ethnic wear at Shubharambh Collection, Seldoh, Maharashtra.
          </p>
        </div>
      </div>

      <div className="container catalog-body">
        {/* Filters Card */}
        <div className="catalog-filters glass animate-fade-in-up">
          {/* Categories */}
          <div className="catalog-filters__section">
            <span className="filter-label">Categories</span>
            <div className="cat-tags">
              <button
                className={`cat-tag ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All Categories
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

          {/* Occasion Tags */}
          <div className="catalog-filters__section">
            <span className="filter-label">Shop by Occasion</span>
            <div className="cat-tags">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  className={`cat-tag ${activeOccasion === occ.id ? "active" : ""}`}
                  onClick={() => setActiveOccasion(occ.id)}
                >
                  {occ.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls row: Price Range, Search, Sort */}
          <div className="catalog-filters__controls">
            <div className="filter-group">
              <label className="filter-label" htmlFor="price-filter">Price Range</label>
              <select
                id="price-filter"
                className="filter-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group filter-group--search">
              <label className="filter-label" htmlFor="search-input">Search Saree or Outfit</label>
              <input
                id="search-input"
                type="text"
                placeholder="e.g. Banarasi, Paithani, Red Lehenga..."
                className="filter-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="sort-select">Sort By</label>
              <select
                id="sort-select"
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

        {/* Results Bar */}
        <div className="catalog-results-bar">
          <p className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of {allProducts.length} unique pieces
          </p>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearAllFilters}>
              ✕ Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <CatalogSkeletonGrid />
        ) : filteredProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty card">
            <span className="catalog-empty__icon">🔍</span>
            <h3>No Products Match Your Filters</h3>
            <p>Try resetting your price range, category, or search keywords.</p>
            <button className="btn btn-outline" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense
      fallback={
        <div className="catalog-page">
          <div className="catalog-header">
            <div className="container">
              <h1 className="catalog-title font-display">Our Collection</h1>
              <p className="catalog-subtitle">Loading catalog items...</p>
            </div>
          </div>
          <div className="container catalog-body">
            <CatalogSkeletonGrid />
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
