"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CATEGORIES,
  formatPrice,
  SHOP_INFO,
  getWhatsAppLink,
} from "@/lib/constants";
import { fetchProducts } from "@/lib/productsStore";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import "./product.css";

export default function ProductPage() {
  const params = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
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

  const product = allProducts.find((p) => p.id === params.id);

  const handleWhatsAppOrder = async (product) => {
    if (!product) return;
    
    setIsOrdering(true);
    const orderSize = selectedSize || product.sizes?.[0] || "Free Size";

    try {
      // 1. Save order in Supabase
      const { error } = await supabase.from("orders").insert([
        {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          status: "pending",
          customer_details: {
            size: orderSize,
            color: product.color || "As shown",
          },
        },
      ]);

      if (error) throw error;

      // 2. Build message
      const message = `Hi Shubharambh Collection,

I want to order:

🛍️ Product: ${product.name}
🎨 Color: ${product.color || "As shown"}
📏 Size: ${orderSize}
💰 Price: ₹${product.price}

🔗 Product Link: ${window.location.href}

Please confirm availability.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodedMessage}`;

      // 3. User Feedback & Redirect
      alert("Redirecting to WhatsApp...");
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container" style={{ textAlign: "center", paddingTop: "150px" }}>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "16px" }}>
            Product Not Found
          </h1>
          <p style={{ color: "var(--clr-text-secondary)", marginBottom: "24px" }}>
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/catalog" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === product.category);
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const whatsappLink = getWhatsAppLink(
    product.name,
    product.price,
    selectedSize || product.sizes?.[0] || "Free Size"
  );

  const productImages = product.images || [product.image];

  return (
    <div className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-breadcrumb animate-fade-in">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/catalog">Catalog</Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category}`}>
            {category?.name || "All"}
          </Link>
          <span>/</span>
          <span className="product-breadcrumb__current">{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-gallery animate-fade-in-up">
            <div className="product-gallery__main">
              <Image
                src={productImages[activeImage] || product.image}
                alt={product.name}
                width={600}
                height={750}
                className="product-gallery__image"
                priority
              />
              {product.isNew && (
                <span className="badge badge-new product-gallery__badge">New Arrival</span>
              )}
              {product.isTrending && (
                <span className="badge badge-trending product-gallery__badge" style={{ top: product.isNew ? "50px" : "12px" }}>
                  🔥 Trending
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="product-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-gallery__thumb ${activeImage === i ? "product-gallery__thumb--active" : ""}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <Image src={img} alt="" width={80} height={100} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info animate-fade-in-up delay-1">
            {category && (
              <span className="product-info__category">
                {category.icon} {category.name}
              </span>
            )}
            <h1 className="product-info__name font-display">{product.name}</h1>
            <p className="product-info__price text-gradient">{formatPrice(product.price)}</p>
            <div className="divider"></div>

            <p className="product-info__desc">{product.description}</p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-sizes">
                <label className="product-sizes__label">Select Size</label>
                <div className="product-sizes__grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`product-sizes__btn ${selectedSize === size ? "product-sizes__btn--active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                      id={`size-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Order Button */}
            <button
              onClick={() => handleWhatsAppOrder(product)}
              disabled={isOrdering}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              id="whatsapp-order-btn"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {isOrdering ? "Processing..." : "Order on WhatsApp"}
            </button>

            <p className="product-info__note">
              📱 Click the button above to send a pre-filled WhatsApp message with your order details.
            </p>

            {/* Trust indicators */}
            <div className="product-trust">
              <div className="product-trust__item">
                <span>🛡️</span> 100% Authentic
              </div>
              <div className="product-trust__item">
                <span>🏪</span> Available in Store
              </div>
              <div className="product-trust__item">
                <span>📦</span> Pan-India Delivery
              </div>
              <div className="product-trust__item">
                <span>💬</span> WhatsApp Support
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="product-related">
            <h2 className="section-title font-display">
              You May Also <span className="text-gradient">Like</span>
            </h2>
            <div className="divider"></div>
            <div className="product-related__grid">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
