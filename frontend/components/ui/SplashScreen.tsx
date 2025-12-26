import React from 'react';
import { motion } from 'framer-motion';
import { AppIcon } from './AppIcon';

export const SplashScreen: React.FC = () => {
	return (
		<div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#5ba350] dark:bg-[#43813b] overflow-hidden">
			{/* Background Decorative Element */}
			<div className="absolute inset-0 opacity-10 pointer-events-none">
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
					</pattern>
					<rect width="100" height="100" fill="url(#grid)" />
				</svg>
			</div>

			<div className="relative flex flex-col items-center">
				{/* Logo Entrance */}
				<motion.div
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: "spring",
						stiffness: 260,
						damping: 20,
						duration: 0.8
					}}
					className="relative"
				>
					<div className="absolute inset-0 blur-2xl bg-white/20 rounded-full scale-125 animate-pulse" />
					<AppIcon className="w-32 h-32 md:w-40 md:h-40 shadow-2xl rounded-[32px] relative z-10" size={512} />
				</motion.div>

				{/* Text Animation */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className="mt-8 text-center"
				>
					<h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-sm">
						DLS<span className="opacity-80">PRO</span>
					</h1>
					<div className="mt-1 flex items-center justify-center space-x-2">
						<span className="h-[1px] w-4 bg-white/30" />
						<p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
							Analytical Engine
						</p>
						<span className="h-[1px] w-4 bg-white/30" />
					</div>
				</motion.div>
			</div>

			{/* Modern Progress Loader */}
			<div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 space-y-3">
				<div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
					<motion.div
						initial={{ x: '-100%' }}
						animate={{ x: '100%' }}
						transition={{
							repeat: Infinity,
							duration: 1.5,
							ease: "easeInOut"
						}}
						className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"
					/>
				</div>
				<p className="text-[9px] font-bold text-white/50 text-center uppercase tracking-widest animate-pulse">
					Initializing Systems...
				</p>
			</div>

			{/* Version Tag */}
			<div className="absolute bottom-6 text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">
				Duckworth-Lewis-Stern v2.4.0
			</div>
		</div>
	);
};