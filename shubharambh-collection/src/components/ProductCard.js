"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/constants";
import "./ProductCard.css";

export default function ProductCard({ product, index = 0 }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="product-card card animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
      id={`product-card-${product.id}`}
    >
      <div className="product-card__image-wrap">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={500}
          className="product-card__image"
        />
        <div className="product-card__overlay">
          <span className="product-card__view">View Details →</span>
        </div>
        <div className="product-card__badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isTrending && <span className="badge badge-trending">🔥 Trending</span>}
        </div>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price text-gold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
