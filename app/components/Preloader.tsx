"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<"show" | "blur" | "exit">("show");

  useEffect(() => {
    // Phase 1: Show Clear (1s) -> Start Blur/Zoom
    const timer1 = setTimeout(() => setPhase("blur"), 1000);
    
    // Phase 2: Blur (2s) -> Exit
    const timer2 = setTimeout(() => setPhase("exit"), 3000);

    // Phase 3: Exit (0.5s) -> Complete
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background with Zoom + Blur Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ filter: "blur(0px)", scale: 1 }}
        animate={
          phase === "blur" || phase === "exit"
            ? { filter: "blur(20px)", scale: 1.5 }
            : { filter: "blur(0px)", scale: 1 }
        }
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        <Image
          src="/preloader.png"
          alt="Loading"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </motion.div>
    </motion.div>
  );
}
