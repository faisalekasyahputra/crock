"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PreloaderProps {
	onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
	const [phase, setPhase] = useState<"enter" | "hold" | "blur" | "exit">(
		"enter",
	);

	useEffect(() => {
		// Phase 1: Enter - text fades in (0.8s)
		const t1 = setTimeout(() => setPhase("hold"), 800);

		// Phase 2: Hold - stay visible (1.2s)
		const t2 = setTimeout(() => setPhase("blur"), 2000);

		// Phase 3: Blur + Zoom out (2s)
		const t3 = setTimeout(() => setPhase("exit"), 4000);

		// Phase 4: Fade out and complete (0.5s)
		const t4 = setTimeout(() => onComplete(), 4500);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
		};
	}, [onComplete]);

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
			initial={{ opacity: 1 }}
			animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
			transition={{ duration: 0.5 }}>
			{/* Background Image - blur fade in + zoom out on enter */}
			<motion.div
				className="absolute inset-0 w-full h-full"
				initial={{ scale: 1.5, filter: "blur(30px)", opacity: 0 }}
				animate={
					phase === "blur" || phase === "exit"
						? { scale: 1.6, filter: "blur(30px)", opacity: 1 }
						: { scale: 1, filter: "blur(0px)", opacity: 1 }
				}
				transition={{ duration: 2, ease: "easeOut" }}>
				<Image
					src="/preloader/bg.avif"
					alt="Loading Background"
					fill
					className="object-cover"
					priority
					unoptimized
				/>
			</motion.div>

			{/* Dark Overlay for contrast */}
			<div className="absolute inset-0 bg-black/40 pointer-events-none" />

			{/* Text Logo */}
			<motion.div
				className="relative z-10 w-[400px] h-[200px]"
				initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
				animate={
					phase === "blur" || phase === "exit"
						? { opacity: 0, scale: 2.5, filter: "blur(20px)" }
						: { opacity: 1, scale: 2, filter: "blur(0px)" }
				}
				transition={{
					duration: phase === "enter" ? 1.2 : 1.5,
					ease: "easeOut",
				}}>
				<Image
					src="/preloader/text.avif"
					alt="CROAK"
					fill
					className="object-contain"
					priority
					unoptimized
				/>
			</motion.div>
		</motion.div>
	);
}
