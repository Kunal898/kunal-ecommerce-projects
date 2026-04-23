import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export const metadata = {
  title: "Shubharambh Collection | Premium Sarees & Ethnic Wear - Seldoh, Maharashtra",
  description:
    "Discover exquisite Banarasi, Kanjivaram, Paithani silk sarees, designer ethnic wear & wedding collections at Shubharambh Collection, Seldoh, Maharashtra 442104. Shop via video reels & order on WhatsApp.",
  keywords:
    "sarees, silk sarees, Banarasi saree, Kanjivaram, Paithani, ethnic wear, wedding collection, Seldoh, Wardha, Maharashtra, Indian clothing",
  openGraph: {
    title: "Shubharambh Collection | Premium Sarees & Ethnic Wear",
    description:
      "Shop stunning sarees & ethnic wear through video reels. Order directly on WhatsApp!",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}
