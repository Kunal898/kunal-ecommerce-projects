"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/constants";
import { fetchProducts } from "@/lib/productsStore";
import { getReels, saveReel, fetchReels, deleteReel, toggleReelActive } from "@/lib/reelsStore";
import { supabase } from "@/lib/supabase";
import "../dashboard/dashboard.css";
import "./admin-reels.css";

export default function AdminReelsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [reels, setReels] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Upload form state
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [reelTitle, setReelTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const videoRef = useRef(null);

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("sc_admin");
    if (!auth) router.push("/admin/login");
    else {
      setIsAuth(true);
      loadReels();
      loadCatalog();
    }
  }, [router]);

  const loadReels = async () => {
    setLoading(true);
    const data = await fetchReels();
    setReels(data);
    setLoading(false);
    // Sync local for public fallback
    localStorage.setItem("sc_reels", JSON.stringify(data));
  };

  const loadCatalog = async () => {
    const data = await fetchProducts();
    setCatalogProducts(data);
  };

  // Handle video file selection
  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid video file (MP4, WebM, MOV, AVI)");
      return;
    }

    // Validate size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("Video file must be under 50MB");
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Auto-generate thumbnail from video after a short delay
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 1; // seek to 1 second
      }
    }, 500);
  };

  // Handle thumbnail file selection
  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreviewUrl(URL.createObjectURL(file));
  };

  // Auto-generate thumbnail from video
  const generateThumbnail = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setThumbnailPreviewUrl(dataUrl);
    } catch (err) {
      console.log("Could not auto-generate thumbnail:", err);
    }
  };

  // Handle upload/save
  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file");
      return;
    }
    if (!selectedProduct) {
      alert("Please link this reel to a product");
      return;
    }

    setUploading(true);

    try {
      let videoUrl = "";
      let thumbnailUrl = "";

      // 1. Upload Video to Supabase Storage
      const videoExt = videoFile.name.split(".").pop();
      const videoPath = `reels/${Date.now()}_${Math.random().toString(36).substring(7)}.${videoExt}`;
      
      const { data: vData, error: vError } = await supabase.storage
        .from("reels")
        .upload(videoPath, videoFile);

      if (vError) throw vError;
      
      // Get public URL
      const { data: vPublicUrl } = supabase.storage
        .from("reels")
        .getPublicUrl(videoPath);
      
      videoUrl = vPublicUrl.publicUrl;

      // 2. Upload Thumbnail if exists
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbPath = `thumbnails/${Date.now()}.${thumbExt}`;
        const { error: tError } = await supabase.storage
          .from("thumbnails")
          .upload(thumbPath, thumbnailFile);
        
        if (!tError) {
          const { data: tPublicUrl } = supabase.storage
            .from("thumbnails")
            .getPublicUrl(thumbPath);
          thumbnailUrl = tPublicUrl.publicUrl;
        }
      } else if (thumbnailPreviewUrl && thumbnailPreviewUrl.startsWith("data:")) {
        // If it's a data URL (from auto-generate), convert to blob and upload
        const res = await fetch(thumbnailPreviewUrl);
        const blob = await res.blob();
        const thumbPath = `thumbnails/${Date.now()}.jpg`;
        const { error: tError } = await supabase.storage
          .from("thumbnails")
          .upload(thumbPath, blob, { contentType: "image/jpeg" });
        
        if (!tError) {
          const { data: tPublicUrl } = supabase.storage
            .from("thumbnails")
            .getPublicUrl(thumbPath);
          thumbnailUrl = tPublicUrl.publicUrl;
        }
      }

      const product = catalogProducts.find((p) => p.id === selectedProduct);

      // 3. Save to Media table
      const { data: mData, error: mError } = await supabase.from("media").insert([
        {
          product_id: selectedProduct,
          url: videoUrl,
          type: "video",
          title: reelTitle || product?.name || "Untitled Reel",
          is_thumbnail: false,
          is_active: true,
          // We can store the thumbnail URL in a metadata field or just use the product image as fallback
          // For now, let's just use the store logic to keep it simple for the UI components
        }
      ]).select();

      if (mError) throw mError;

      // Also update local store for immediate UI feedback (until we fully migrate all components)
      const newReel = saveReel({
        id: mData[0].id,
        title: reelTitle || product?.name || "Untitled Reel",
        productId: selectedProduct,
        productName: product?.name || "Unknown",
        price: product?.price || 0,
        category: product?.category || "",
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl || product?.image || "/images/products/banarasi.png",
        videoFileName: videoFile.name,
        videoFileSize: videoFile.size,
        isActive: true,
      });

      setReels(getReels());
      setSuccessMsg(`"${newReel.title}" uploaded successfully!`);
      resetForm();
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message || "Please check your Supabase Storage permissions."}`);
    } finally {
      setUploading(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    setSelectedProduct("");
    setReelTitle("");
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteReel(id);
      await loadReels();
      setDeleteConfirm(null);
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle active
  const handleToggle = async (id) => {
    const reel = reels.find((r) => r.id === id);
    if (!reel) return;
    try {
      await toggleReelActive(id, reel.isActive);
      await loadReels();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isAuth) return null;

  return (
    <div className="admin-dash">
      {/* Header */}
      <div className="admin-dash__header">
        <div className="container">
          <div className="admin-dash__header-inner">
            <div>
              <h1 className="admin-dash__title font-display">
                Manage <span className="text-gradient">Reels</span>
              </h1>
              <p className="admin-dash__sub">
                Upload product videos • {reels.length} reel{reels.length !== 1 ? "s" : ""} uploaded
              </p>
            </div>
            <div className="admin-dash__header-actions">
              <Link href="/admin/dashboard" className="btn btn-ghost btn-sm">← Dashboard</Link>
              <button
                onClick={() => { setShowUpload(!showUpload); resetForm(); }}
                className={`btn ${showUpload ? "btn-ghost" : "btn-accent"} btn-sm`}
              >
                {showUpload ? "✕ Cancel" : "+ Upload Reel"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-dash__body">
        {/* Success Message */}
        {successMsg && (
          <div className="upload-success animate-fade-in-up">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* ═══ UPLOAD FORM ═══ */}
        {showUpload && (
          <div className="upload-panel glass animate-fade-in-up">
            <h3 className="upload-panel__title font-display">
              📹 Upload New Reel
            </h3>

            <div className="upload-grid">
              {/* Left: Video Upload */}
              <div className="upload-video-section">
                {!videoPreviewUrl ? (
                  <div
                    className="upload-dropzone"
                    onClick={() => videoInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("upload-dropzone--active"); }}
                    onDragLeave={(e) => e.currentTarget.classList.remove("upload-dropzone--active")}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("upload-dropzone--active");
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        // Simulate input change
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        videoInputRef.current.files = dt.files;
                        handleVideoSelect({ target: { files: [file] } });
                      }
                    }}
                  >
                    <div className="upload-dropzone__icon">🎬</div>
                    <p className="upload-dropzone__title">Drop video here or click to browse</p>
                    <p className="upload-dropzone__hint">MP4, WebM, MOV • Max 50MB</p>
                    <p className="upload-dropzone__hint">Short product videos (15–60 sec recommended)</p>
                  </div>
                ) : (
                  <div className="upload-preview">
                    <div className="upload-preview__video-wrap">
                      <video
                        ref={videoRef}
                        src={videoPreviewUrl}
                        controls
                        className="upload-preview__video"
                        onLoadedData={generateThumbnail}
                      />
                    </div>
                    <div className="upload-preview__info">
                      <p className="upload-preview__filename">
                        📎 {videoFile?.name}
                      </p>
                      <p className="upload-preview__size">
                        {formatSize(videoFile?.size || 0)}
                      </p>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreviewUrl(null);
                          setThumbnailPreviewUrl(null);
                          if (videoInputRef.current) videoInputRef.current.value = "";
                        }}
                      >
                        🗑️ Remove Video
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  onChange={handleVideoSelect}
                  style={{ display: "none" }}
                  id="video-upload-input"
                />
              </div>

              {/* Right: Details */}
              <div className="upload-details-section">
                {/* Reel Title */}
                <div className="upload-field">
                  <label className="upload-field__label">Reel Title (optional)</label>
                  <input
                    type="text"
                    className="upload-field__input"
                    placeholder="e.g. Red Banarasi Saree Showcase"
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    id="reel-title-input"
                  />
                </div>

                {/* Link to Product */}
                <div className="upload-field">
                  <label className="upload-field__label">Link to Product *</label>
                  <select
                    className="upload-field__select"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    id="reel-product-select"
                  >
                    <option value="">— Select a product —</option>
                    {catalogProducts.length > 0 ? (
                      catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatPrice(p.price)}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>⚠️ No products found. Add products first!</option>
                    )}
                  </select>
                  {selectedProduct && (
                    <div className="upload-field__product-preview">
                      {(() => {
                        const p = catalogProducts.find((x) => x.id === selectedProduct);
                        if (!p) return null;
                        return (
                          <>
                            <Image src={p.image} alt={p.name} width={48} height={64} style={{ borderRadius: "8px", objectFit: "cover" }} />
                            <div>
                              <strong>{p.name}</strong>
                              <p className="text-gold">{formatPrice(p.price)}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Custom Thumbnail */}
                <div className="upload-field">
                  <label className="upload-field__label">
                    Thumbnail {thumbnailPreviewUrl ? "✅" : "(auto-generated from video)"}
                  </label>
                  <div className="upload-thumb-row">
                    {thumbnailPreviewUrl && (
                      <div className="upload-thumb-preview">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumbnailPreviewUrl} alt="Thumbnail" />
                      </div>
                    )}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => thumbInputRef.current?.click()}
                    >
                      📸 {thumbnailPreviewUrl ? "Replace" : "Upload"} Thumbnail
                    </button>
                  </div>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    style={{ display: "none" }}
                    id="thumb-upload-input"
                  />
                </div>

                {/* Upload Button */}
                <button
                  className={`btn btn-accent btn-lg upload-btn ${uploading ? "upload-btn--loading" : ""}`}
                  onClick={() => {
                    if (!videoFile) {
                      alert("❌ Please select a video file first!");
                      return;
                    }
                    if (!selectedProduct) {
                      alert("❌ Please link this reel to a product from the dropdown!");
                      return;
                    }
                    handleUpload();
                  }}
                  disabled={uploading}
                  id="upload-reel-btn"
                >
                  {uploading ? (
                    <>
                      <span className="upload-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>🚀 Publish Reel</>
                  )}
                </button>

                <p className="upload-note">
                  💡 In production, videos are uploaded to Supabase Storage for optimal delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ UPLOADED REELS LIST ═══ */}
        {reels.length > 0 && (
          <>
            <h2 className="admin-dash__section-title">
              Your Uploaded Reels ({reels.length})
            </h2>
            <div className="admin-reels-grid">
              {reels.map((reel, i) => (
                <div
                  key={reel.id}
                  className={`admin-reel-card card animate-fade-in-up ${!reel.isActive ? "admin-reel-card--inactive" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Video/Thumbnail preview */}
                  <div className="admin-reel-card__media">
                    {reel.videoUrl ? (
                      <video
                        src={reel.videoUrl}
                        className="admin-reel-card__video"
                        muted
                        playsInline
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                    ) : reel.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={reel.thumbnailUrl} alt={reel.title} className="admin-reel-card__thumb" />
                    ) : (
                      <div className="admin-reel-card__placeholder">🎬</div>
                    )}

                    {/* Status badge */}
                    <span className={`admin-reel-card__status ${reel.isActive ? "admin-reel-card__status--live" : "admin-reel-card__status--draft"}`}>
                      {reel.isActive ? "🟢 Live" : "⏸️ Hidden"}
                    </span>

                    {/* Play icon */}
                    <div className="admin-reel-card__play-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="admin-reel-card__info">
                    <h4 className="admin-reel-card__title">{reel.title}</h4>
                    <p className="admin-reel-card__product">
                      🏷️ {reel.productName}
                    </p>
                    <p className="admin-reel-card__price text-gold">
                      {formatPrice(reel.price)}
                    </p>
                    <p className="admin-reel-card__meta">
                      📎 {reel.videoFileName || "video.mp4"} •{" "}
                      {reel.videoFileSize ? formatSize(reel.videoFileSize) : "—"}
                    </p>
                    <p className="admin-reel-card__date">
                      {new Date(reel.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* Actions */}
                    <div className="admin-reel-card__actions">
                      <button
                        className={`btn btn-sm ${reel.isActive ? "btn-outline" : "btn-primary"}`}
                        onClick={() => handleToggle(reel.id)}
                        title={reel.isActive ? "Hide from website" : "Show on website"}
                      >
                        {reel.isActive ? "⏸️ Hide" : "▶️ Show"}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm admin-reel-card__delete-btn"
                        onClick={() => setDeleteConfirm(reel.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === reel.id && (
                      <div className="admin-reel-card__confirm animate-fade-in">
                        <p>Delete this reel?</p>
                        <div className="admin-reel-card__confirm-actions">
                          <button
                            className="btn btn-sm"
                            style={{ background: "#ef4444", color: "white" }}
                            onClick={() => handleDelete(reel.id)}
                          >
                            Yes, Delete
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══ EMPTY STATE ═══ */}
        {reels.length === 0 && !showUpload && (
          <div className="admin-reels-empty animate-fade-in-up">
            <span className="admin-reels-empty__icon">🎬</span>
            <h3 className="font-display">No Reels Uploaded Yet</h3>
            <p>Upload your first product video to start engaging customers with reel-style shopping.</p>
            <button
              className="btn btn-accent btn-lg"
              onClick={() => setShowUpload(true)}
            >
              + Upload Your First Reel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
