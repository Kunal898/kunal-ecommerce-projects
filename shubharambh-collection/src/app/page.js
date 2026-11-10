"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import {
  SHOP_INFO,
  CATEGORIES,
  formatPrice,
  getWhatsAppChatLink,
} from "@/lib/constants";
import { TESTIMONIALS } from "@/lib/siteContent";
import ProductCard from "@/components/ProductCard";
import { fetchReels } from "@/lib/reelsStore";
import { fetchProducts } from "@/lib/productsStore";
import "./page.css";

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [uploadedReels, setUploadedReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [pData, rData] = await Promise.all([
          fetchProducts(),
          fetchReels()
        ]);
        setAllProducts(pData);
        setUploadedReels(rData.filter(r => r.isActive));
      } catch (err) {
        console.error("Load home data error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const trendingProducts = allProducts.filter((p) => p.isTrending);
  const newProducts = allProducts.filter((p) => p.isNew);

  return (
    <div className="home">
      {/* ══════ HERO ══════ */}
      <section className="hero" id="hero-section">
        <div className="hero__bg">
          <Image
            src="/images/shop/hero-bg.png"
            alt="Premium Ethnic Wear Collection"
            fill
            priority
            className="hero__bg-image"
          />
          <div className="hero__bg-overlay"></div>
          <div className="hero__bg-gradient"></div>
        </div>

        <div className="hero__content container">
          <div className="hero__badge animate-fade-in-up">
            <span className="hero__badge-dot"></span>
            📍 Seldoh, Maharashtra 442104
          </div>
          <h1 className="hero__title font-display animate-fade-in-up delay-1">
            <span className="text-gradient">Banarasi &amp; Silk Sarees</span>
            <br />
            Saree Shop Near Wardha &amp; Seldoh
          </h1>
          <p className="hero__subtitle animate-fade-in-up delay-2">
            Discover handpicked Banarasi, Kanjivaram &amp; Paithani silk sarees at Shubharambh Collection, Seldoh, Maharashtra.
            Watch video reels, choose your favourite piece, and order directly on WhatsApp.
          </p>
          <div className="hero__actions animate-fade-in-up delay-3">
            <Link href="/reels" className="btn btn-accent btn-lg">
              ▶ Watch Reels
            </Link>
            <Link href="/catalog" className="btn btn-outline btn-lg">
              Browse Catalog
            </Link>
          </div>

          <div className="hero__stats animate-fade-in-up delay-4">
            <div className="hero__stat">
              <span className="hero__stat-number">500+</span>
              <span className="hero__stat-label">Collections</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">10K+</span>
              <span className="hero__stat-label">Happy Customers</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">4.8★</span>
              <span className="hero__stat-label">Google Rating</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <span></span>
        </div>
      </section>

      {/* ══════ CATEGORIES ══════ */}
      <section className="section categories-section" id="categories-section">
        <div className="container">
          <h2 className="section-title font-display">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle">Explore our curated collections</p>

          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className="category-chip animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
                id={`category-${cat.id}`}
              >
                <span className="category-chip__icon">{cat.icon}</span>
                <span className="category-chip__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ REELS (admin-uploaded only) ══════ */}
      {uploadedReels.length > 0 && (
      <section className="section reels-preview" id="reels-preview">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title font-display">
                Trending <span className="text-gradient">Reels</span>
              </h2>
              <div className="divider"></div>
              <p className="section-subtitle">Watch product videos & shop instantly</p>
            </div>
            <Link href="/reels" className="btn btn-outline">
              View All Reels →
            </Link>
          </div>

          <div className="reels-scroll">
            {uploadedReels.slice(0, 4).map((reel, i) => (
              <Link
                key={reel.id}
                href="/reels"
                className="reel-card animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
                id={`reel-${reel.id}`}
              >
                <div className="reel-card__image-wrap">
                  {reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      className="reel-card__image"
                      muted
                      playsInline
                      loop
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                  ) : reel.thumbnailUrl ? (
                    <Image
                      src={reel.thumbnailUrl}
                      alt={`${reel.productName} Saree Video Reel at Shubharambh Collection`}
                      width={300}
                      height={500}
                      className="reel-card__image"
                    />
                  ) : null}
                  <div className="reel-card__play">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="reel-card__info">
                    <p className="reel-card__name">{reel.productName}</p>
                    <p className="reel-card__price">{formatPrice(reel.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ══════ TRENDING PRODUCTS ══════ */}
      <section className="section" id="trending-products">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title font-display">
                🔥 Trending <span className="text-gradient">Now</span>
              </h2>
              <div className="divider"></div>
              <p className="section-subtitle">Our most loved pieces this season</p>
            </div>
            <Link href="/catalog" className="btn btn-outline">
              Browse Full Catalog →
            </Link>
          </div>

          <div className="products-grid">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ NEW ARRIVALS ══════ */}
      <section className="section new-arrivals" id="new-arrivals">
        <div className="container">
          <h2 className="section-title font-display">
            ✨ New <span className="text-gradient">Arrivals</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle">Fresh additions to our collection</p>

          <div className="products-grid">
            {newProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CUSTOMER REVIEWS & TESTIMONIALS ══════ */}
      <section className="section testimonials-section" id="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title font-display">
                Loved by <span className="text-gradient">Our Customers</span>
              </h2>
              <div className="divider"></div>
              <p className="section-subtitle">Real experiences from saree lovers across Maharashtra</p>
            </div>
            <a
              href="https://g.page/r/your-google-review-link"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              ⭐ 4.8 on Google (100+ Reviews)
            </a>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((review, i) => (
              <div
                key={review.id}
                className="testimonial-card card animate-fade-in-up"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="testimonial-card__header">
                  <div className="testimonial-card__avatar">{review.initial}</div>
                  <div>
                    <h3 className="testimonial-card__name">{review.name}</h3>
                    <p className="testimonial-card__location">{review.location}</p>
                  </div>
                </div>
                <div className="testimonial-card__rating">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <p className="testimonial-card__quote">&ldquo;{review.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ VISIT OUR STORE ══════ */}
      <section className="section visit-section" id="visit-section">
        <div className="container">
          <div className="visit-content">
            <div className="visit-images">
              <div className="visit-images__main animate-fade-in-up">
                <Image
                  src="/images/shop/shop-photo-1.jpg"
                  alt="Shubharambh Collection - Saree Shop in Seldoh Near Wardha, Maharashtra"
                  width={600}
                  height={450}
                  className="visit-images__img"
                />
                <div className="visit-images__badge glass">
                  <span>📍</span>
                  <span>Real Shop Photos</span>
                </div>
              </div>
              <div className="visit-images__secondary animate-fade-in-up delay-2">
                <Image
                  src="/images/shop/shop-photo-2.jpg"
                  alt="Shubharambh Collection Seldoh - Banarasi & Silk Sarees Showroom"
                  width={300}
                  height={250}
                  className="visit-images__img"
                />
              </div>
              <div className="visit-images__secondary animate-fade-in-up delay-3">
                <Image
                  src="/images/shop/shop-photo-3.jpg"
                  alt="Shubharambh Collection Seldoh - Ethnic Wear Store Interior"
                  width={300}
                  height={250}
                  className="visit-images__img"
                />
              </div>
            </div>

            <div className="visit-info animate-fade-in-up delay-1">
              <span className="badge badge-new">🏪 Visit Us</span>
              <h2 className="section-title font-display">
                Visit Our Saree Shop in <span className="text-gradient">Seldoh, Maharashtra</span>
              </h2>
              <div className="divider"></div>
              <p className="visit-info__text">
                Experience our collection in person at our store near Samruddhi Interchange,
                IC-03, Seldoh, Maharashtra (near Wardha). Touch the fabric, feel the quality, and find your perfect outfit.
              </p>

              <div className="visit-details">
                <div className="visit-detail">
                  <span className="visit-detail__icon">📍</span>
                  <div>
                    <strong>Address</strong>
                    <p>{SHOP_INFO.address}</p>
                  </div>
                </div>
                <div className="visit-detail">
                  <span className="visit-detail__icon">🕐</span>
                  <div>
                    <strong>Timings</strong>
                    <p>{SHOP_INFO.timings}</p>
                  </div>
                </div>
                <div className="visit-detail">
                  <span className="visit-detail__icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>{SHOP_INFO.email}</p>
                  </div>
                </div>
              </div>

              <div className="visit-actions">
                <a
                  href={getWhatsAppChatLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  💬 Ask a Question on WhatsApp
                </a>
                <Link href="/contact" className="btn btn-outline">
                  📍 View on Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ TRUST BANNER ══════ */}
      <section className="trust-banner" id="trust-banner">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item animate-fade-in-up">
              <span className="trust-item__icon">🛡️</span>
              <span className="trust-item__text">100% Authentic</span>
            </div>
            <div className="trust-item animate-fade-in-up delay-1">
              <span className="trust-item__icon">🏪</span>
              <span className="trust-item__text">Physical Store</span>
            </div>
            <div className="trust-item animate-fade-in-up delay-2">
              <span className="trust-item__icon">⭐</span>
              <span className="trust-item__text">4.8 Google Rating</span>
            </div>
            <div className="trust-item animate-fade-in-up delay-3">
              <span className="trust-item__icon">📦</span>
              <span className="trust-item__text">Pan-India Delivery</span>
            </div>
            <div className="trust-item animate-fade-in-up delay-4">
              <span className="trust-item__icon">💬</span>
              <span className="trust-item__text">WhatsApp Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
