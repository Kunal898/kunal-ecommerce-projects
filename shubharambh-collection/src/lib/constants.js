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
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0!2d78.7!3d20.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSeldoh%2C+Wardha!5e0!3m2!1sen!2sin!4v1700000000000",
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
    category: "silk-sarees",
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
    category: "silk-sarees",
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
    category: "silk-sarees",
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
    category: "designer-sarees",
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
    category: "mens-collection",
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
    category: "wedding-collection",
    description:
      "Stunning red and gold bridal lehenga choli with heavy zardozi embroidery. Make your wedding day unforgettable.",
    sizes: ["S", "M", "L", "XL"],
    image: "/images/products/lehenga.png",
    images: ["/images/products/lehenga.png"],
    isNew: true,
    isTrending: true,
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

export function getWhatsAppChatLink() {
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=Hi%2C%20I%20have%20a%20query%20about%20your%20collection.`;
}

export function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}
