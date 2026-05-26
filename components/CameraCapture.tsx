"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, RotateCcw, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "idle" | "camera" | "preview";

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function CameraCapture() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("idle");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capturePhoto = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setPreviewSrc(screenshot);
      setMode("preview");
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      // Resize to max 1920px on longest side to keep file small
      const MAX = 1920;
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > MAX || h > MAX) {
        if (w >= h) { h = Math.round((h * MAX) / w); w = MAX; }
        else { w = Math.round((w * MAX) / h); h = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      // Convert to JPEG — handles HEIC, WebP, PNG, etc.
      setPreviewSrc(canvas.toDataURL("image/jpeg", 0.85));
      setMode("preview");
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      // Fallback: read as-is if canvas fails
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewSrc(ev.target?.result as string);
        setMode("preview");
      };
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  };

  const handleAnalyze = async () => {
    if (!previewSrc) return;
    setLoading(true);
    setError(null);

    try {
      const blob = await fetch(previewSrc).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      const analyzeRes = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!analyzeRes.ok) throw new Error("Skin analysis failed");
      const skinData = await analyzeRes.json();

      const routineRes = await fetch("/api/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skinData),
      });
      if (!routineRes.ok) throw new Error("Routine generation failed");

      sessionStorage.setItem("skinData", JSON.stringify(skinData));
      const routineData = await routineRes.json();
      sessionStorage.setItem("routineData", JSON.stringify(routineData));

      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {mode === "camera" && (
        <motion.div
          key="camera"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="rounded-2xl overflow-hidden bg-black aspect-3/4 relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user", aspectRatio: 3 / 4 }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-white/20 rounded-2xl pointer-events-none" />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode("idle")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={capturePhoto}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <Camera className="w-4 h-4" /> Take Photo
            </motion.button>
          </div>
        </motion.div>
      )}

      {mode === "preview" && previewSrc && (
        <motion.div
          key="preview"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden aspect-3/4 bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 text-center bg-red-50 rounded-xl px-4 py-3"
            >
              {error}
            </motion.p>
          )}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode("idle")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </motion.button>
            <motion.button
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              onClick={handleAnalyze}
              disabled={loading}
              className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 transition-colors overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" /> Analyze
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {mode === "idle" && (
        <motion.div
          key="idle"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(17,17,17,0.18)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode("camera")}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-gray-900 text-white font-semibold transition-colors"
          >
            <Camera className="w-5 h-5" /> Take a Selfie
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, borderColor: "#9ca3af", backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-medium transition-colors"
          >
            <Upload className="w-5 h-5" /> Upload a Photo
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          <p className="text-xs text-center text-gray-400 pt-2">
            Your photo is only used for analysis and never stored.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
