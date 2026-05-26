"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Camera,
  Shield,
  ChevronDown,
  Zap,
  Globe,
  ArrowRight,
  Star,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ── DATA ─────────────────────────────────────────────────────── */

const steps = [
  { num: "01", icon: <Camera className="w-5 h-5" />, title: "Snap a selfie", desc: "Upload or take a photo — well-lit, centered face" },
  { num: "02", icon: <Sparkles className="w-5 h-5" />, title: "AI scans your skin", desc: "Perfect Corp CV detects type, tone, and concerns" },
  { num: "03", icon: <Zap className="w-5 h-5" />, title: "Routine generated", desc: "Nemotron LLM crafts your morning & night routine" },
  { num: "04", icon: <Globe className="w-5 h-5" />, title: "Shop globally", desc: "Curated products available worldwide, any budget" },
];

const features = [
  { icon: <Camera className="w-6 h-6 text-rose-500" />, iconBg: "bg-rose-50 border-rose-100", title: "Real skin analysis", desc: "Computer vision detects your actual skin type, tone, and concerns — not a quiz" },
  { icon: <Sparkles className="w-6 h-6 text-purple-500" />, iconBg: "bg-purple-50 border-purple-100", title: "AI-generated routine", desc: "Morning & night routine crafted by Nvidia Nemotron, tailored to your skin profile" },
  { icon: <Shield className="w-6 h-6 text-emerald-600" />, iconBg: "bg-emerald-50 border-emerald-100", title: "Always-on resilience", desc: "5-level fallback: TrueFoundry → Nemotron → Llama → Qwen → Static. You always get a response" },
  { icon: <Globe className="w-6 h-6 text-amber-500" />, iconBg: "bg-amber-50 border-amber-100", title: "Built for tropical skin", desc: "Climate-aware recommendations — designed for Gen Z in Southeast Asia, Africa, and Latin America" },
];

const stats = [
  { value: "$189B", label: "Global skincare market" },
  { value: "68%", label: "Want personalized skincare" },
  { value: "63%", label: "Don't know their skin type" },
  { value: "30s", label: "Time to get your routine" },
];

/* ── HERO VISUAL ──────────────────────────────────────────────── */

const floatingCards = [
  { label: "Oily skin detected", sub: "Confidence 94%", bg: "bg-rose-50/90", border: "border-rose-200", labelColor: "text-rose-800", subColor: "text-rose-400", top: "8%", left: "2%" },
  { label: "Nemotron active", sub: "LLM • Crusoe Cloud", bg: "bg-purple-50/90", border: "border-purple-200", labelColor: "text-purple-800", subColor: "text-purple-400", top: "62%", left: "0%" },
  { label: "CeraVe Cleanser", sub: "$ • Recommended", bg: "bg-emerald-50/90", border: "border-emerald-200", labelColor: "text-emerald-800", subColor: "text-emerald-500", top: "18%", right: "0%" },
  { label: "Routine ready", sub: "5 + 4 steps", bg: "bg-amber-50/90", border: "border-amber-200", labelColor: "text-amber-800", subColor: "text-amber-500", bottom: "18%", right: "0%" },
];

/* ── PAGE ─────────────────────────────────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="bg-linear-to-br from-rose-100 via-pink-50 to-emerald-100 min-h-screen overflow-hidden">

      {/* ── HEADER ─────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-rose-100"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="text-rose-500 w-5 h-5" />
          <span className="font-semibold text-gray-900 text-lg tracking-tight">SkinMatch AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1 rounded-full font-medium">
            Beta
          </span>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Try Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* ── HERO ───────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20">
        {/* Decorative orbs */}
        <div className="orb orb-rose w-96 h-96 -top-20 -left-20" />
        <div className="orb orb-peach w-80 h-80 top-40 -right-16" />
        <div className="orb orb-purple w-64 h-64 bottom-20 left-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left — text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/70 border border-rose-200 text-rose-600 text-xs font-medium px-4 py-2 rounded-full mb-6 shadow-sm"
            >
              <Star className="w-3 h-3 fill-rose-500 text-rose-500" />
              Built for tropical &amp; diverse skin types
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-gray-900 mb-6"
            >
              Your skin,
              <br />
              <span className="bg-linear-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                your climate,
              </span>
              <br />
              your routine.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-gray-500 text-lg sm:text-xl mb-10 max-w-md leading-relaxed"
            >
              Snap a selfie. Get a personalized skincare routine powered by AI —
              designed for Gen Z skin in every climate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-rose-300/50 hover:shadow-rose-400/60 transition-shadow"
                >
                  <Camera className="w-5 h-5" />
                  Analyze My Skin
                </Link>
              </motion.div>
              <span className="text-xs text-gray-400">Free • No sign-up • 30 seconds</span>
            </motion.div>
          </motion.div>

          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-120 lg:h-150 rounded-3xl overflow-hidden shadow-2xl shadow-rose-200/40"
          >
            <Image
              src="/hero.png"
              alt="AI skin analysis"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Floating info cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                className={`absolute backdrop-blur-sm ${card.bg} border ${card.border} rounded-xl px-3 py-2 min-w-max shadow-sm`}
                style={{ top: card.top, left: card.left, right: card.right, bottom: card.bottom }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, -4, 0] }}
                transition={{
                  opacity: { delay: 0.8 + i * 0.2, duration: 0.5 },
                  y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
                }}
              >
                <p className={`text-xs font-semibold leading-tight ${card.labelColor}`}>{card.label}</p>
                <p className={`text-[10px] mt-0.5 ${card.subColor}`}>{card.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <section className="border-y border-rose-100 bg-white/60 backdrop-blur-sm py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium text-rose-500 uppercase tracking-widest mb-3 block">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">From selfie to routine in 4 steps</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative bg-white/80 border border-gray-100 rounded-2xl p-6 shadow-sm group"
            >
              <div className="absolute -top-3 left-6 bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {step.num}
              </div>
              <div className="mt-4 mb-3 w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors">
                {step.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{step.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section className="py-24 bg-white/50 border-y border-rose-100 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium text-purple-500 uppercase tracking-widest mb-3 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything your skin needs</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/80 border border-gray-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────── */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-linear-to-r from-rose-400 to-pink-400 rounded-full blur-2xl opacity-30" />
            <span className="relative text-5xl">✨</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Ready to meet
            <br />
            <span className="bg-linear-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              your skin match?
            </span>
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Free analysis. No sign-up. Results in 30 seconds.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-500 text-white px-10 py-5 rounded-2xl text-lg font-semibold shadow-xl shadow-rose-300/50 hover:shadow-rose-400/60 transition-shadow"
            >
              <Camera className="w-6 h-6" />
              Analyze My Skin — Free
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-rose-100 bg-white/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-rose-500 w-4 h-4" />
            <span className="font-medium text-gray-500 text-sm">SkinMatch AI</span>
          </div>
          <p className="text-xs text-gray-400">
            Built for DevNetwork AI + ML Hackathon 2026 · Powered by Perfect Corp × Crusoe × TrueFoundry
          </p>
        </div>
      </footer>
    </main>
  );
}
