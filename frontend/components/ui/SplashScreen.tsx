import React from 'react';
import { motion } from 'framer-motion';
import { AppIcon } from './AppIcon';

export const SplashScreen: React.FC = () => {
	const containerVariants = {
		exit: {
			opacity: 0,
			scale: 1.1,
			filter: "blur(10px)",
			transition: {
				duration: 0.8,
				ease: [0.43, 0.13, 0.23, 0.96]
			}
		}
	};

	const childVariants = {
		initial: { y: 20, opacity: 0 },
		animate: { y: 0, opacity: 1 },
	};

	return (
		<motion.div
			variants={containerVariants}
			exit="exit"
			className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#5ba350] dark:bg-[#43813b] overflow-hidden"
		>
			{/* Dynamic Background Decorative Element */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.1 }}
				transition={{ duration: 2 }}
				className="absolute inset-0 pointer-events-none"
			>
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
					</pattern>
					<rect width="100" height="100" fill="url(#grid)" />
				</svg>
			</motion.div>

			<div className="relative flex flex-col items-center">
				{/* Logo Entrance */}
				<motion.div
					initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
					animate={{ scale: 1, opacity: 1, rotate: 0 }}
					transition={{
						type: "spring",
						stiffness: 120,
						damping: 20,
						duration: 1
					}}
					className="relative"
				>
					<div className="absolute inset-0 blur-3xl bg-white/30 rounded-full scale-150 animate-pulse" />
					<AppIcon className="w-32 h-32 md:w-40 md:h-40 shadow-2xl rounded-[32px] relative z-10" size={512} />
				</motion.div>

				{/* Text Animation with Stagger */}
				<motion.div
					initial="initial"
					animate="animate"
					transition={{ delayChildren: 0.5, staggerChildren: 0.15 }}
					className="mt-8 text-center"
				>
					<motion.h1
						variants={childVariants}
						className="text-4xl font-black text-white tracking-tighter drop-shadow-lg"
					>
						DLS<span className="opacity-80">PRO</span>
					</motion.h1>

					<motion.div
						variants={childVariants}
						className="mt-2 flex items-center justify-center space-x-3"
					>
						<span className="h-[1px] w-6 bg-white/40" />
						<p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80">
							Analytical Engine
						</p>
						<span className="h-[1px] w-6 bg-white/40" />
					</motion.div>
				</motion.div>
			</div>

			{/* Modern Progress Loader */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 1 }}
				className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 space-y-4"
			>
				<div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
					<motion.div
						initial={{ x: '-100%' }}
						animate={{ x: '100%' }}
						transition={{
							repeat: Infinity,
							duration: 2,
							ease: "easeInOut"
						}}
						className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"
					/>
				</div>
				<p className="text-[10px] font-bold text-white/60 text-center uppercase tracking-[0.3em] animate-pulse">
					Syncing Data...
				</p>
			</motion.div>

			{/* Version Tag */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ delay: 1.5 }}
				className="absolute bottom-8 text-[9px] font-bold text-white uppercase tracking-[0.25em]"
			>
				Precision Metrics v2.4.0
			</motion.div>
		</motion.div>
	);
};
