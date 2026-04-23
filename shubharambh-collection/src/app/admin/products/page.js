"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, formatPrice } from "@/lib/constants";
import { fetchProducts, addProduct, deleteProduct } from "@/lib/productsStore";
import { supabase } from "@/lib/supabase";
import "../dashboard/dashboard.css";
import "./admin-products.css";

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    sizes: "Free Size",
    image: "",
    isNew: false,
    isTrending: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      sizes: "Free Size",
      image: "",
      isNew: false,
      isTrending: false,
    });
    setEditingProduct(null);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      sizes: product.sizes?.join(", ") || "Free Size",
      image: product.image,
      isNew: product.isNew || false,
      isTrending: product.isTrending || false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem("sc_admin");
    if (!auth) router.push("/admin/login");
    else {
      setIsAuth(true);
      loadInitialData();
    }
  }, [router]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([
        fetchProducts(),
        supabase.from("categories").select("*").order("sort_order")
      ]);
      setProducts(pData);
      setDbCategories(cData.data || []);
      // Sync local for public fallback
      localStorage.setItem("sc_products", JSON.stringify(pData));
    } catch (err) {
      console.error("Initial load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
    localStorage.setItem("sc_products", JSON.stringify(data));
  };

  // Handle image file selection and upload
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, file);
      if (error) throw error;

      const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, image: publicUrl.publicUrl }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle add/edit submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in name, price, and category");
      return;
    }

    setLoading(true);
    const sizesArray = formData.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const productData = {
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      description: formData.description,
      sizes: sizesArray,
      image_url: formData.image || "/images/products/banarasi.png",
      isNew: formData.isNew,
      isTrending: formData.isTrending,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            name: productData.name,
            price: productData.price,
            category_id: productData.category, 
            description: productData.description,
            sizes: productData.sizes,
            image_url: productData.image_url,
            is_new: productData.isNew,
            is_trending: productData.isTrending
          })
          .eq("id", editingProduct.id);
        if (error) throw error;
        showSuccess(`"${formData.name}" updated!`);
      } else {
        const { error } = await supabase.from("products").insert([
          {
            name: productData.name,
            price: productData.price,
            category_id: productData.category,
            description: productData.description,
            sizes: productData.sizes,
            image_url: productData.image_url,
            is_new: productData.isNew,
            is_trending: productData.isTrending,
          }
        ]);
        if (error) throw error;
        showSuccess(`"${formData.name}" added to catalog!`);
      }
      await loadProducts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert("Error saving product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      await loadProducts();
      setDeleteConfirm(null);
      showSuccess("Product deleted successfully.");
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle status
  const toggleStatus = async (id, field) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const dbField = field === "isNew" ? "is_new" : "is_trending";
    
    try {
      const { error } = await supabase
        .from("products")
        .update({ [dbField]: !product[field] })
        .eq("id", id);
      if (error) throw error;
      await loadProducts();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // Note: Reset removed as we are now using real database data


  if (!isAuth) return null;

  return (
    <div className="admin-dash">
      {/* Header */}
      <div className="admin-dash__header">
        <div className="container">
          <div className="admin-dash__header-inner">
            <div>
              <h1 className="admin-dash__title font-display">
                Manage <span className="text-gradient">Products</span>
              </h1>
              <p className="admin-dash__sub">
                {products.length} product{products.length !== 1 ? "s" : ""} in catalog
              </p>
            </div>
            <div className="admin-dash__header-actions">
              <Link href="/admin/dashboard" className="btn btn-ghost btn-sm">← Dashboard</Link>
              <button
                className={`btn ${showForm ? "btn-ghost" : "btn-accent"} btn-sm`}
                onClick={() => { setShowForm(!showForm); resetForm(); }}
              >
                {showForm ? "✕ Cancel" : "+ Add Product"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-dash__body">
        {/* Success */}
        {successMsg && (
          <div className="upload-success animate-fade-in-up">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* ═══ ADD/EDIT FORM ═══ */}
        {showForm && (
          <div className="admin-product-form glass animate-fade-in-up">
            <h3 className="admin-product-form__title font-display">
              {editingProduct ? "✏️ Edit Product" : "📦 Add New Product"}
            </h3>

            <div className="admin-product-form__grid">
              {/* Image upload */}
              <div className="admin-product-form__image-section">
                <label className="apf-label">Product Image</label>
                <div
                  className="apf-image-upload"
                  onClick={() => document.getElementById("product-image-input")?.click()}
                >
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.image} alt="Preview" className="apf-image-preview" />
                  ) : (
                    <>
                      <span className="apf-image-icon">📸</span>
                      <p>Click to upload image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="product-image-input"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
              </div>

              {/* Form fields */}
              <div className="admin-product-form__fields">
                <div className="apf-row">
                  <div className="apf-field">
                    <label className="apf-label">Product Name *</label>
                    <input
                      className="apf-input"
                      placeholder="e.g. Royal Banarasi Silk Saree"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      id="product-name"
                    />
                  </div>
                  <div className="apf-field">
                    <label className="apf-label">Price (₹) *</label>
                    <input
                      className="apf-input"
                      type="number"
                      placeholder="4500"
                      value={formData.price}
                      onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                      id="product-price"
                    />
                  </div>
                </div>

                <div className="apf-row">
                  <div className="apf-field">
                    <label className="apf-label">Category *</label>
                    <select
                      className="apf-select"
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      id="product-category"
                    >
                      <option value="">— Select —</option>
                      {dbCategories.length > 0 ? (
                        dbCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))
                      ) : (
                        CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="apf-field">
                    <label className="apf-label">Sizes (comma-separated)</label>
                    <input
                      className="apf-input"
                      placeholder="Free Size or S, M, L, XL"
                      value={formData.sizes}
                      onChange={(e) => setFormData((p) => ({ ...p, sizes: e.target.value }))}
                      id="product-sizes"
                    />
                  </div>
                </div>

                <div className="apf-field">
                  <label className="apf-label">Description</label>
                  <textarea
                    className="apf-input apf-textarea"
                    placeholder="Describe this product..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    id="product-desc"
                  />
                </div>

                {/* Toggles */}
                <div className="apf-toggles">
                  <label className="apf-toggle">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData((p) => ({ ...p, isNew: e.target.checked }))}
                    />
                    <span className="apf-toggle__switch"></span>
                    ✨ New Arrival
                  </label>
                  <label className="apf-toggle">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData((p) => ({ ...p, isTrending: e.target.checked }))}
                    />
                    <span className="apf-toggle__switch"></span>
                    🔥 Trending
                  </label>
                </div>

                <button
                  className="btn btn-accent btn-lg apf-submit"
                  onClick={handleSubmit}
                  id="save-product-btn"
                >
                  {editingProduct ? "💾 Save Changes" : "🚀 Add to Catalog"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PRODUCT LIST ═══ */}
        <h2 className="admin-dash__section-title">
          All Products ({products.length})
        </h2>

        <div className="admin-products-list">
          {products.map((product, i) => {
            const cat = CATEGORIES.find((c) => c.id === product.category);
            return (
              <div
                key={product.id}
                className="admin-product-row glass animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Image */}
                <div className="apr-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={100}
                    className="apr-image__img"
                  />
                </div>

                {/* Info */}
                <div className="apr-info">
                  <h4 className="apr-info__name">{product.name}</h4>
                  <p className="apr-info__category">{cat?.icon} {cat?.name || product.category}</p>
                  <p className="apr-info__price text-gold">{formatPrice(product.price)}</p>
                  <p className="apr-info__sizes">{product.sizes?.join(", ")}</p>
                </div>

                {/* Badges */}
                <div className="apr-badges">
                  <button
                    className={`apr-badge ${product.isNew ? "apr-badge--active" : ""}`}
                    onClick={() => toggleStatus(product.id, "isNew")}
                    title="Toggle New Arrival"
                  >
                    ✨ {product.isNew ? "New" : "Not New"}
                  </button>
                  <button
                    className={`apr-badge ${product.isTrending ? "apr-badge--active apr-badge--trending" : ""}`}
                    onClick={() => toggleStatus(product.id, "isTrending")}
                    title="Toggle Trending"
                  >
                    🔥 {product.isTrending ? "Trending" : "Not Trending"}
                  </button>
                </div>

                {/* Actions */}
                <div className="apr-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => startEdit(product)}
                  >
                    ✏️ Edit
                  </button>
                  {deleteConfirm === product.id ? (
                    <div className="apr-delete-confirm">
                      <button
                        className="btn btn-sm"
                        style={{ background: "#ef4444", color: "white" }}
                        onClick={() => handleDelete(product.id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm apr-delete-btn"
                      onClick={() => setDeleteConfirm(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 16px" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>📦</span>
            <h3 className="font-display" style={{ marginBottom: "8px" }}>No Products</h3>
            <p style={{ color: "var(--clr-text-secondary)", marginBottom: "16px" }}>Your catalog is empty.</p>
            <button className="btn btn-accent" onClick={() => setShowForm(true)}>+ Add First Product</button>
          </div>
        )}
      </div>
    </div>
  );
}
