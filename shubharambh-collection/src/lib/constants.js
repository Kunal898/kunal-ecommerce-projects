// ═══════════════════════════════════════════════════════════════
// Shubharambh Collection — Site Constants
// ═══════════════════════════════════════════════════════════════

export const SHOP_INFO = {
  name: "Shubharambh Collection",
  tagline: "Elegance Woven in Every Thread",
  address: "Samruddhi, Interchange, IC-03, Seldoh, Maharashtra 442104",
  phone: "+919766530018",
  whatsapp: "919766530018",
  email: "shubharambhcollection@gmail.com", // Assumed — confirm with owner
  timings: "Open Daily · Closes 8:00 PM",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Samruddhi%20Interchange%2C%20IC-03%2C%20Seldoh%2C%20Maharashtra%20442104&t=&z=15&ie=UTF8&iwloc=&output=embed",
  instagram: "https://www.instagram.com/shubharambh_collection_seldoh?igsh=cjc2eTV1OTY3dnky",
  facebook: "#",
};

export const CATEGORIES = [
  { id: "silk-sarees", name: "Silk Sarees", icon: "✨" },
  { id: "designer-sarees", name: "Designer Sarees", icon: "💎" },
  { id: "wedding-collection", name: "Wedding Collection", icon: "💍" },
  { id: "ethnic-wear", name: "Ethnic Wear", icon: "🪔" },
  { id: "casual-wear", name: "Casual Wear", icon: "🌸" },
  { id: "mens-collection", name: "Men's Collection", icon: "👔" },
];

export const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Royal Banarasi Silk Saree",
    price: 4500,
    priceOnRequest: false,
    category: "silk-sarees",
    occasion: "wedding",
    description:
      "Exquisite red and gold Banarasi silk saree with intricate zari work. Perfect for weddings and festive occasions. Handcrafted by artisans from Varanasi.",
    sizes: ["Free Size"],
    image: "/images/products/banarasi.png",
    images: ["/images/products/banarasi.png"],
    isNew: true,
    isTrending: true,
  },
  {
    id: "2",
    name: "Royal Blue Kanjivaram Saree",
    price: 6800,
    priceOnRequest: false,
    category: "silk-sarees",
    occasion: "festive",
    description:
      "Stunning royal blue Kanjivaram silk saree with rich temple border design. A timeless piece from South Indian heritage.",
    sizes: ["Free Size"],
    image: "/images/products/kanjivaram.png",
    images: ["/images/products/kanjivaram.png"],
    isNew: false,
    isTrending: true,
  },
  {
    id: "3",
    name: "Purple Paithani Silk Saree",
    price: 5200,
    priceOnRequest: false,
    category: "silk-sarees",
    occasion: "festive",
    description:
      "Elegant purple and golden Paithani saree with traditional peacock motif pallu. A Maharashtrian masterpiece.",
    sizes: ["Free Size"],
    image: "/images/products/paithani.png",
    images: ["/images/products/paithani.png"],
    isNew: true,
    isTrending: false,
  },
  {
    id: "4",
    name: "Emerald Designer Saree",
    price: 3200,
    priceOnRequest: false,
    category: "designer-sarees",
    occasion: "party",
    description:
      "Modern emerald green designer saree with sequin work and golden border. Perfect for cocktail parties and reception events.",
    sizes: ["Free Size"],
    image: "/images/products/designer.png",
    images: ["/images/products/designer.png"],
    isNew: false,
    isTrending: true,
  },
  {
    id: "5",
    name: "Navy Silk Kurta Pajama Set",
    price: 2800,
    priceOnRequest: false,
    category: "mens-collection",
    occasion: "casual",
    description:
      "Premium navy blue silk kurta pajama set with embroidered neckline. Ideal for festivals and celebrations.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/images/products/kurta.png",
    images: ["/images/products/kurta.png"],
    isNew: true,
    isTrending: false,
  },
  {
    id: "6",
    name: "Bridal Lehenga Choli Set",
    price: 12500,
    priceOnRequest: false,
    category: "wedding-collection",
    occasion: "wedding",
    description:
      "Stunning red and gold bridal lehenga choli with heavy zardozi embroidery. Make your wedding day unforgettable.",
    sizes: ["S", "M", "L", "XL"],
    image: "/images/products/lehenga.png",
    images: ["/images/products/lehenga.png"],
    isNew: true,
    isTrending: true,
  },
  {
    id: "7",
    name: "Pure Chanderi Silk Saree",
    price: null,
    priceOnRequest: true,
    category: "silk-sarees",
    occasion: "festive",
    description:
      "Handcrafted pure Chanderi silk saree with antique zari motifs and contrast pallu. Exclusive boutique weave.",
    sizes: ["Free Size"],
    image: "/images/products/banarasi.png",
    images: ["/images/products/banarasi.png"],
    isNew: true,
    isTrending: false,
  },
];

export const DEMO_REELS = [
  {
    id: "r1",
    productId: "1",
    productName: "Royal Banarasi Silk Saree",
    price: 4500,
    thumbnail: "/images/products/banarasi.png",
    category: "silk-sarees",
  },
  {
    id: "r2",
    productId: "2",
    productName: "Royal Blue Kanjivaram Saree",
    price: 6800,
    thumbnail: "/images/products/kanjivaram.png",
    category: "silk-sarees",
  },
  {
    id: "r3",
    productId: "6",
    productName: "Bridal Lehenga Choli Set",
    price: 12500,
    thumbnail: "/images/products/lehenga.png",
    category: "wedding-collection",
  },
  {
    id: "r4",
    productId: "4",
    productName: "Emerald Designer Saree",
    price: 3200,
    thumbnail: "/images/products/designer.png",
    category: "designer-sarees",
  },
  {
    id: "r5",
    productId: "3",
    productName: "Purple Paithani Silk Saree",
    price: 5200,
    thumbnail: "/images/products/paithani.png",
    category: "silk-sarees",
  },
  {
    id: "r6",
    productId: "5",
    productName: "Navy Silk Kurta Pajama Set",
    price: 2800,
    thumbnail: "/images/products/kurta.png",
    category: "mens-collection",
  },
];

export function getWhatsAppLink(productName, price, size) {
  const message = `Hi, I want to order *${productName}*%0APrice: ₹${price.toLocaleString("en-IN")}%0ASize: ${size || "Free Size"}`;
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${message}`;
}

export function getWhatsAppOrderLink(productName, category, price) {
  const categoryName = CATEGORIES.find(c => c.id === category)?.name || category || "";
  const priceText = price ? `Price: ₹${price.toLocaleString("en-IN")}` : "Price on request";
  const message = encodeURIComponent(
    `Hi, I'm interested in ${productName}${categoryName ? ` (${categoryName})` : ""} - ${priceText}. Is this available?`
  );
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${message}`;
}

export function getWhatsAppChatLink() {
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=Hi%2C%20I%20have%20a%20query%20about%20your%20collection.`;
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === 0) return "Price on Request";
  return `₹${price.toLocaleString("en-IN")}`;
}
