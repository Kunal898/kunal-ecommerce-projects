import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export const metadata = {
  title: "Shubharambh Collection | Saree Shop Near Wardha, Seldoh, Maharashtra",
  description:
    "Discover exquisite Banarasi, Kanjivaram & Paithani silk sarees and bridal collections at Shubharambh Collection, Seldoh, Maharashtra 442104. Best saree shop near Wardha. Watch video reels & order on WhatsApp.",
  keywords:
    "saree shop near Wardha, Banarasi sarees Seldoh Maharashtra, Paithani sarees, Kanjivaram silk sarees, bridal lehenga Wardha, Shubharambh Collection, ethnic wear Seldoh, Indian wedding sarees",
  openGraph: {
    title: "Shubharambh Collection | Saree Shop Near Wardha, Seldoh",
    description:
      "Shop stunning Banarasi, Paithani & silk sarees through video reels. Order directly on WhatsApp with pan-India delivery!",
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
