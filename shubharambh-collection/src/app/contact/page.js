"use client";

import Image from "next/image";
import { SHOP_INFO, getWhatsAppChatLink } from "@/lib/constants";
import "./contact.css";

export default function ContactPage() {
  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <h1 className="contact-header__title font-display">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="contact-header__sub">
            Visit our store, chat on WhatsApp, or find us on the map
          </p>
        </div>
      </div>

      <div className="container contact-body">
        {/* Contact Grid */}
        <div className="contact-grid">
          {/* Info Cards */}
          <div className="contact-info animate-fade-in-up">
            <div className="contact-card glass">
              <span className="contact-card__icon">📍</span>
              <h3 className="contact-card__title">Visit Us</h3>
              <p className="contact-card__text">{SHOP_INFO.address}</p>
            </div>

            <div className="contact-card glass">
              <span className="contact-card__icon">🕐</span>
              <h3 className="contact-card__title">Business Hours</h3>
              <p className="contact-card__text">{SHOP_INFO.timings}</p>
            </div>

            <div className="contact-card glass">
              <span className="contact-card__icon">📧</span>
              <h3 className="contact-card__title">Email Us</h3>
              <a href={`mailto:${SHOP_INFO.email}`} className="contact-card__link">
                {SHOP_INFO.email}
              </a>
            </div>

            <div className="contact-card">
              <span className="contact-card__icon">📸</span>
              <h3 className="contact-card__title">Instagram</h3>
              <p className="contact-card__text">Follow us for latest updates!</p>
              <a 
                href={SHOP_INFO.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-card__link"
              >
                @shubharambh_collection_seldoh
              </a>
            </div>

            <div className="contact-card contact-card--whatsapp">
              <span className="contact-card__icon">💬</span>
              <h3 className="contact-card__title">Chat on WhatsApp</h3>
              <p className="contact-card__text">Get instant replies!</p>
              <a
                href={getWhatsAppChatLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp contact-card__btn"
              >
                Start Chat →
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="contact-map animate-fade-in-up delay-1">
            <div className="contact-map__wrap">
              <iframe
                src={SHOP_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shubharambh Collection Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Shop Gallery */}
        <section className="contact-gallery section" id="shop-gallery">
          <h2 className="section-title font-display">
            Our <span className="text-gradient">Store</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle">Real photos from Shubharambh Collection</p>

          <div className="gallery-grid">
            <div className="gallery-item gallery-item--large animate-fade-in-up">
              <Image
                src="/images/shop/shop-photo-1.jpg"
                alt="Shubharambh Collection - Store View"
                width={800}
                height={600}
                className="gallery-item__img"
              />
              <div className="gallery-item__caption glass">
                <span>📸</span> Shubharambh Collection — Seldoh, Maharashtra
              </div>
            </div>

            <div className="gallery-item animate-fade-in-up delay-1">
              <Image
                src="/images/shop/shop-photo-2.jpg"
                alt="Shubharambh Collection Interior"
                width={600}
                height={450}
                className="gallery-item__img"
              />
              <div className="gallery-item__caption glass">
                <span>📸</span> Inside Our Store
              </div>
            </div>

            <div className="gallery-item animate-fade-in-up delay-2">
              <Image
                src="/images/shop/shop-photo-3.jpg"
                alt="Shubharambh Collection Products"
                width={600}
                height={450}
                className="gallery-item__img"
              />
              <div className="gallery-item__caption glass">
                <span>📸</span> Our Collection Display
              </div>
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="contact-trust animate-fade-in-up">
          <div className="contact-trust__inner glass">
            <h3 className="font-display contact-trust__title">
              Why Shop With Us?
            </h3>
            <div className="contact-trust__grid">
              <div className="contact-trust__item">
                <span>🏪</span>
                <strong>Real Physical Store</strong>
                <p>Visit us at Seldoh, Maharashtra</p>
              </div>
              <div className="contact-trust__item">
                <span>🛡️</span>
                <strong>100% Authentic Products</strong>
                <p>Genuine handcrafted ethnic wear</p>
              </div>
              <div className="contact-trust__item">
                <span>⭐</span>
                <strong>4.8 Google Rating</strong>
                <p>Trusted by thousands of customers</p>
              </div>
              <div className="contact-trust__item">
                <span>📦</span>
                <strong>Pan-India Delivery</strong>
                <p>We ship across the country</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
