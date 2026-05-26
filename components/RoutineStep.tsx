"use client";

import { motion } from "framer-motion";

type Step = {
  name: string;
  description: string;
  tip?: string;
};

type Props = {
  step: Step;
  index: number;
};

export default function RoutineStep({ step, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex gap-4 items-start"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.08 + 0.1 }}
        className="shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5"
      >
        {index}
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{step.name}</p>
        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.description}</p>
        {step.tip && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{step.tip}</p>
        )}
      </div>
    </motion.div>
  );
}
