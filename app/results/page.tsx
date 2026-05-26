"use client";

import SkinReportCard from "@/components/SkinReportCard";
import FallbackBanner from "@/components/FallbackBanner";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-10"
      >
        <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
          <Link href="/analyze" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <h1 className="text-base font-semibold text-gray-900">Your Skin Report</h1>
        </div>
      </motion.header>

      {/* Decorative orbs */}
      <div className="orb orb-purple w-72 h-72 -top-16 -right-16 pointer-events-none" />
      <div className="orb orb-rose w-56 h-56 bottom-20 -left-12 pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 max-w-2xl mx-auto px-6 py-8 space-y-6"
      >
        <FallbackBanner level={null} />
        <SkinReportCard />
      </motion.div>
    </main>
  );
}
