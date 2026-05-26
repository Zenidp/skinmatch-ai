import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "SkinMatch AI — Personalized Skincare for Every Skin, Every Climate",
  description:
    "AI-powered skincare advisor built for tropical and diverse skin types. Get your personalized routine in seconds.",
  keywords: ["skincare", "AI", "skin analysis", "tropical skin", "Gen Z beauty"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
