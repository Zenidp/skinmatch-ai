"use client";

import CameraCapture from "@/components/CameraCapture";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-emerald-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-10"
      >
        <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <h1 className="text-base font-semibold text-gray-900">Analyze Your Skin</h1>
        </div>
      </motion.header>

      {/* Decorative orbs */}
      <div className="orb orb-rose w-72 h-72 -top-16 -right-16 pointer-events-none" />
      <div className="orb orb-peach w-56 h-56 bottom-20 -left-12 pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 max-w-lg mx-auto px-6 py-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mb-8 text-center"
        >
          Take a clear selfie or upload a photo — make sure your face is well-lit and centered.
        </motion.p>
        <CameraCapture />
      </motion.div>
    </main>
  );
}
