"use client";

import { useState } from "react";
import Image from "next/image";
import { SHOP_INFO, getWhatsAppChatLink } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/siteContent";
import "./contact.css";

function FAQAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id || null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="faq-list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`faq-item card ${isOpen ? "faq-item--open" : ""}`}
          >
            <button
              type="button"
              className="faq-item__question"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className="faq-item__title">{item.question}</span>
              <span className="faq-item__indicator" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="faq-item__answer animate-fade-in">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      {/* Header with SEO Title */}
      <div className="contact-header">
        <div className="container">
          <h1 className="contact-header__title font-display">
            Saree Shop Near Wardha in <span className="text-gradient">Seldoh, Maharashtra</span>
          </h1>
          <p className="contact-header__sub">
            Visit our physical showroom at Samruddhi Interchange, chat directly with us on WhatsApp, or view our location on Google Maps.
          </p>
        </div>
      </div>

      <div className="container contact-body">
        {/* Contact Info Grid */}
        <div className="contact-grid">
          {/* Info Cards */}
          <div className="contact-info animate-fade-in-up">
            <div className="contact-card card">
              <span className="contact-card__icon">📍</span>
              <h2 className="contact-card__title">Store Location</h2>
              <p className="contact-card__text">{SHOP_INFO.address}</p>
              <span className="contact-card__landmark">Near Wardha &amp; Samruddhi Expressway IC-03</span>
            </div>

            <div className="contact-card card">
              <span className="contact-card__icon">🕐</span>
              <h2 className="contact-card__title">Store Timings</h2>
              <p className="contact-card__text">{SHOP_INFO.timings}</p>
            </div>

            <div className="contact-card card">
              <span className="contact-card__icon">📧</span>
              <h2 className="contact-card__title">Email Support</h2>
              <a href={`mailto:${SHOP_INFO.email}`} className="contact-card__link">
                {SHOP_INFO.email}
              </a>
            </div>

            <div className="contact-card card">
              <span className="contact-card__icon">📸</span>
              <h2 className="contact-card__title">Instagram Reels &amp; Updates</h2>
              <p className="contact-card__text">Follow our daily saree reels &amp; new arrivals!</p>
              <a
                href={SHOP_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card__link"
              >
                @shubharambh_collection_seldoh
              </a>
            </div>

            <div className="contact-card contact-card--whatsapp card">
              <span className="contact-card__icon">💬</span>
              <h2 className="contact-card__title">Order or Inquire on WhatsApp</h2>
              <p className="contact-card__text">
                Ask about saree availability, custom sizes, or delivery times. Instant replies from our staff!
              </p>
              <a
                href={getWhatsAppChatLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp contact-card__btn"
              >
                Ask a Question on WhatsApp →
              </a>
            </div>
          </div>

          {/* Map Embed */}
          <div className="contact-map animate-fade-in-up delay-1">
            <div className="contact-map__header">
              <h2 className="contact-map__heading font-display">
                Location on <span className="text-gradient">Google Maps</span>
              </h2>
              <p className="contact-map__sub">Samruddhi Interchange, IC-03, Seldoh, Maharashtra 442104</p>
            </div>
            <div className="contact-map__wrap">
              <iframe
                src={SHOP_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location - Shubharambh Collection Saree Shop Seldoh Maharashtra"
              />
            </div>
            <a
              href="https://maps.google.com/?q=Samruddhi+Interchange+IC-03+Seldoh+Maharashtra+442104"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline contact-map__btn"
            >
              📍 Open in Google Maps App
            </a>
          </div>
        </div>

        {/* ══════ FAQ SECTION ══════ */}
        <section className="section contact-faq" id="faq-section">
          <div className="section-header">
            <div>
              <h2 className="section-title font-display">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
              <div className="divider"></div>
              <p className="section-subtitle">
                Everything you need to know about shopping, delivery, payments &amp; blouse stitching
              </p>
            </div>
            <a
              href={getWhatsAppChatLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              💬 Have Another Question?
            </a>
          </div>

          <FAQAccordion items={FAQ_ITEMS} />
        </section>

        {/* Shop Gallery with SEO-rich Alt text */}
        <section className="contact-gallery section" id="shop-gallery">
          <h2 className="section-title font-display">
            Our <span className="text-gradient">Showroom</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle">Real photos from Shubharambh Collection store in Seldoh, Maharashtra</p>

          <div className="gallery-grid">
            <div className="gallery-item gallery-item--large animate-fade-in-up">
              <Image
                src="/images/shop/shop-photo-1.jpg"
                alt="Shubharambh Collection Saree Shop - Seldoh Maharashtra Store Front"
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
                alt="Banarasi & Paithani Sarees Display - Shubharambh Collection Seldoh"
                width={600}
                height={450}
                className="gallery-item__img"
              />
              <div className="gallery-item__caption glass">
                <span>📸</span> Banarasi &amp; Silk Sarees Section
              </div>
            </div>

            <div className="gallery-item animate-fade-in-up delay-2">
              <Image
                src="/images/shop/shop-photo-3.jpg"
                alt="Ethnic Wear & Bridal Collection Showroom - Shubharambh Collection"
                width={600}
                height={450}
                className="gallery-item__img"
              />
              <div className="gallery-item__caption glass">
                <span>📸</span> Bridal &amp; Ethnic Wear Collection
              </div>
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="contact-trust animate-fade-in-up">
          <div className="contact-trust__inner card">
            <h3 className="font-display contact-trust__title">
              Why Shop With Shubharambh Collection?
            </h3>
            <div className="contact-trust__grid">
              <div className="contact-trust__item">
                <span>🏪</span>
                <strong>Real Physical Store</strong>
                <p>Visit us at Seldoh, near Wardha</p>
              </div>
              <div className="contact-trust__item">
                <span>🛡️</span>
                <strong>100% Authentic Quality</strong>
                <p>Genuine zari, silk &amp; ethnic wear</p>
              </div>
              <div className="contact-trust__item">
                <span>⭐</span>
                <strong>4.8 Google Rating</strong>
                <p>Trusted by thousands across Maharashtra</p>
              </div>
              <div className="contact-trust__item">
                <span>📦</span>
                <strong>Pan-India Delivery</strong>
                <p>Express dispatch &amp; safe packaging</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
