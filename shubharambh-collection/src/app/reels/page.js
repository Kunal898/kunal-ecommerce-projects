"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatPrice, getWhatsAppLink } from "@/lib/constants";
import { getReels } from "@/lib/reelsStore";
import "./reels.css";

export default function ReelsPage() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    // Load active reels
    const stored = getReels().filter((r) => r.isActive);
    setReels(stored);
  }, []);

  return (
    <div className="reels-page">
      {/* Header */}
      <div className="reels-page__header">
        <div className="container">
          <h1 className="reels-page__title font-display">
            Video <span className="text-gradient">Reels</span>
          </h1>
          <p className="reels-page__subtitle">
            Experience our fashion in motion. Tap any reel to play with audio.
          </p>
          <div className="reels-page__social">
            <a 
              href="https://www.instagram.com/shubharambh_collection_seldoh?igsh=cjc2eTV1OTY3dnky" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reels-page__insta-link"
            >
              📸 Follow us on Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Reels Feed */}
      <div className="reels-feed container">
        {reels.length > 0 ? (
          <div className="reels-grid">
            {reels.map((reel) => (
              <ReelItem key={reel.id} reel={reel} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="reels-empty animate-fade-in-up">
            <span className="reels-empty__icon">🎬</span>
            <h3 className="font-display">No Reels Yet</h3>
            <p>Our team is working on exciting product videos. Check back soon!</p>
            <Link href="/catalog" className="btn btn-accent">
              Browse Catalog →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Reel Item component to manage play/pause and mute state
 */
function ReelItem({ reel }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      videoRef.current.muted = false; // Unmute on interaction
      setIsPlaying(true);
      setIsMuted(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`reel-tile animate-fade-in-up ${isPlaying ? "reel-tile--playing" : ""}`}
      onClick={togglePlay}
    >
      <div className="reel-tile__media">
        {reel.videoUrl ? (
          <div className="reel-video-container">
            <video
              ref={videoRef}
              src={reel.videoUrl}
              className="reel-tile__video"
              muted={isMuted}
              playsInline
              loop
              poster={reel.thumbnailUrl}
            />
            
            {/* Play/Mute Overlays */}
            {!isPlaying && (
              <div className="reel-status-overlay">
                <div className="play-btn">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            {isPlaying && (
              <div className="reel-audio-indicator">
                {isMuted ? "🔇" : "🔊"}
              </div>
            )}
          </div>
        ) : (
          <img
            src={reel.thumbnailUrl || "/images/products/banarasi.png"}
            alt={reel.productName}
            className="reel-tile__image"
          />
        )}

        {/* Info & Badges */}
        <div className="reel-tile__top">
          <span className="reel-tile__badge reel-tile__badge--new glass">
            🎬 Reel
          </span>
        </div>

        <div className="reel-tile__bottom">
          <div className="reel-tile__info">
            <h3 className="reel-tile__name">{reel.title || reel.productName}</h3>
            <p className="reel-tile__price">{formatPrice(reel.price)}</p>
          </div>

          <div className="reel-tile__actions">
            <Link
              href={`/product/${reel.productId}`}
              className="btn btn-accent btn-sm"
              onClick={(e) => e.stopPropagation()}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
