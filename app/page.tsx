"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from "framer-motion";
import Preloader from "./components/Preloader";

export default function Home() {
	const [copied, setCopied] = useState(false);
	const [showPreloader, setShowPreloader] = useState(true);
	const [showHerotext, setShowHerotext] = useState(false);
	const caAddress = "0x1234567890abcdef1234567890abcdef12345678";

	// Control Panel for Hero Text Position (Finalized)
	const heroTextPos = { x: -183, y: -161, scale: 2 };
	const [isFloating, setIsFloating] = useState(false);

	// Flag Animation Controls (Finalized)
	const flagParams = {
		duration: 5,
		rotateZ: 1.5,
		rotateY: 4,
		skewX: 0.5,
	};

	// Scroll Animation Hooks - Removed

	const handlePreloaderComplete = useCallback(() => {
		setShowPreloader(false);
		// Trigger herotext animation immediately after preloader
		setShowHerotext(true);
	}, []);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(caAddress);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const socialLinks = [
		{ name: "X", icon: "/icons/x.png", url: "https://x.com" },
		{ name: "Community", icon: "/icons/community.png", url: "https://t.me" },
		{ name: "Dex", icon: "/icons/dex.png", url: "https://dexscreener.com" },
	];

	return (
		<>
			<div className="bg-black text-white min-h-screen font-sans">
				{/* Preloader */}
				<AnimatePresence mode="wait">
					{showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
				</AnimatePresence>

				{/* SECTION 1: HERO */}
				<section className="hero-section relative h-screen overflow-hidden flex items-center justify-center">
					{/* Hero Video Background */}
					<div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
						<motion.video
							className="w-full h-full object-cover"
							autoPlay
							loop
							muted
							playsInline
							initial={{ scale: 1.25 }}
							animate={{ scale: showPreloader ? 1.25 : 1 }}
							transition={{ duration: 0.8, ease: "circOut" }}
							style={{
								x: "-50%",
								y: "-50%",
								position: "absolute",
								top: "50%",
								left: "50%",
								maskImage: "linear-gradient(to bottom, black 85%, transparent)",
								WebkitMaskImage:
									"linear-gradient(to bottom, black 85%, transparent)",
							}} // Centering logic + Gradient Mask
						>
							<source src="/hero.mp4" type="video/mp4" />
						</motion.video>

						{/* Gradient Overlay Removed - Using Mask Image instead */}
					</div>

					{/* Hero Content */}
					<div className="hero-content relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
						<div
							className="relative pointer-events-auto"
							style={{ transform: "translate(-325px, 50px)" }}>
							{/* Hero Text Logo */}
							<AnimatePresence>
								{showHerotext && (
									<motion.div
										className="absolute flex justify-center pointer-events-none"
										style={{
											top: heroTextPos.y,
											left: heroTextPos.x,
											width: "600px",
											height: "200px",
											transformOrigin: "center center",
										}}
										initial={{ scale: 6, opacity: 0 }}
										animate={
											isFloating
												? {
														scale: heroTextPos.scale,
														opacity: 1,
														rotateZ: [
															0,
															-flagParams.rotateZ,
															flagParams.rotateZ,
															-flagParams.rotateZ / 2,
															flagParams.rotateZ / 2,
															0,
														],
														rotateY: [
															0,
															flagParams.rotateY,
															-flagParams.rotateY,
															0,
														],
														skewX: [0, flagParams.skewX, -flagParams.skewX, 0],
													}
												: {
														scale: heroTextPos.scale,
														opacity: 1,
													}
										}
										transition={
											isFloating
												? {
														duration: flagParams.duration,
														ease: "easeInOut",
														repeat: Infinity,
														repeatType: "mirror",
													}
												: {
														duration: 0.8,
														type: "spring",
														bounce: 0.3,
													}
										}
										onAnimationComplete={() => setIsFloating(true)}>
										<Image
											src="/herotext.png"
											alt="Hero Text"
											fill
											className="object-contain"
											style={{ imageRendering: "auto" }}
											quality={100}
											priority
											unoptimized
										/>
									</motion.div>
								)}
							</AnimatePresence>

							{/* CA Address with Copy Button - Combined */}
							<motion.button
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.5 }}
								className={`
                      px-5 py-3 rounded-full
                      bg-white/10 backdrop-blur-md
                      border border-white/20
                      shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_4px_6px_rgba(0,0,0,0.4)]
                      font-mono text-sm tracking-wider
                      text-white/90
                      transition-all duration-300 ease-out
                      hover:scale-[1.02] hover:bg-white/15 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.35),0_5px_8px_rgba(0,0,0,0.45)]
                      active:scale-[0.98] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                      flex items-center gap-3
                      cursor-pointer
                      mx-auto
                      ${copied ? "bg-green-500/20 border-green-400/30 text-green-300" : ""}
                    `}
								onClick={handleCopy}>
								<span>
									{copied
										? "COPIED!"
										: `${caAddress.slice(0, 6)}...${caAddress.slice(-4)}`}
								</span>
								<span className="flex items-center justify-center">
									{copied ? (
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="3">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									) : (
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2">
											<rect
												x="9"
												y="9"
												width="13"
												height="13"
												rx="2"
												ry="2"></rect>
											<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
										</svg>
									)}
								</span>
							</motion.button>

							{/* Social Media Icons */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7, duration: 0.5 }}
								className="flex items-center justify-center gap-4 mt-6 w-full">
								{socialLinks.map((social) => (
									<a
										key={social.name}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="
                          w-12 h-12 rounded-full
                          bg-white/10 backdrop-blur-md
                          border border-white/20
                          shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_4px_6px_rgba(0,0,0,0.4)]
                          flex items-center justify-center
                          transition-all duration-300 ease-out
                          hover:scale-[1.05] hover:bg-white/15
                          active:scale-[0.98]
                        "
										title={social.name}>
										<Image
											src={social.icon}
											alt={social.name}
											width={24}
											height={24}
											className="brightness-0 invert"
										/>
									</a>
								))}
							</motion.div>
						</div>
					</div>
				</section>

				{/* SECTION 2: FOOTER */}
				<section className="footer-section relative h-[20vh] flex flex-col items-center justify-center py-8 overflow-hidden bg-black">
					{/* FOOTER */}
					<div
						className="
						relative z-10
						px-6 py-3
						bg-white/5 backdrop-blur-lg
						border border-white/10
						rounded-full
						flex items-center justify-between gap-8
						text-white/60 text-sm font-mono
					">
						<div className="mb-2 md:mb-0">&copy; 2026 CROAK.</div>
						<div className="flex gap-6 items-center">
							{[
								{ name: "X", icon: "/icons/x.png", url: "https://x.com" },
								{
									name: "Community",
									icon: "/icons/community.png",
									url: "https://t.me",
								},
								{
									name: "Dex",
									icon: "/icons/dex.png",
									url: "https://dexscreener.com",
								},
							].map((social) => (
								<a
									key={social.name}
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:scale-110 transition-transform duration-300">
									<Image
										src={social.icon}
										alt={social.name}
										width={24}
										height={24}
										className="brightness-0 invert opacity-80 hover:opacity-100"
									/>
								</a>
							))}
						</div>
					</div>
				</section>

				{/* Removed Separate Footer Section */}
			</div>
		</>
	);
}
