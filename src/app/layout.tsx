import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CartGenie AI — Turn Every Visitor Into a Buyer",
  description:
    "CartGenie AI helps you boost conversions, recover abandoned carts, and personalize shopping experiences automatically with AI-powered chatbot technology.",
  keywords: [
    "AI chatbot",
    "ecommerce AI",
    "cart recovery",
    "order management",
    "refund automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Spline CDN — saves DNS + TLS time */}
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        {/* Preload the 3D scene file — starts download immediately */}
        <link
          rel="preload"
          href="https://prod.spline.design/DP5UKPIERCeiygCV/scene.splinecode"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
