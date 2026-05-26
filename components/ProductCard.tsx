"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type Product = {
  name: string;
  brand: string;
  category: string;
  price_range: "$" | "$$" | "$$$";
  why: string;
};

type Props = {
  product: Product;
  index?: number;
};

const PRICE_COLORS: Record<string, string> = {
  $: "text-emerald-600 bg-emerald-50",
  $$: "text-blue-600 bg-blue-50",
  $$$: "text-purple-600 bg-purple-50",
};

export default function ProductCard({ product, index = 0 }: Props) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(product.brand + " " + product.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: "0 12px 36px rgba(0,0,0,0.09)" }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl border border-gray-100 bg-white p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</p>
          <p className="text-xs text-gray-400">{product.brand}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${PRICE_COLORS[product.price_range] ?? ""}`}>
          {product.price_range}
        </span>
      </div>
      <span className="inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mb-2">
        {product.category}
      </span>
      <p className="text-xs text-gray-500 leading-relaxed">{product.why}</p>
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-3 inline-flex items-center gap-1 text-xs text-rose-500 font-medium hover:text-rose-700 transition-colors"
      >
        Find it <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}
