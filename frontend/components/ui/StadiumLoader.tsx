import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Theme } from '../../types';

interface StadiumLoaderProps {
	message?: string;
	loading?: boolean;
	results?: {
		parScore?: number | string;
		targetScore?: number | string;
		adjustedTotal?: number | string;
		customLabel?: string;
		customValue?: number | string;
	};
}

// Sub-component for animating number reveal
const Counter = ({ value }: { value: number | string }) => {
	const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (isNaN(numValue)) return;
		const controls = animate(0, numValue, {
			duration: 1.5,
			ease: "easeOut",
			onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
		});
		return () => controls.stop();
	}, [numValue]);

	return <>{isNaN(numValue) ? value : displayValue}</>;
};

const StadiumLoader: React.FC<StadiumLoaderProps> = ({
	message = "Rain Interruption",
	loading = true,
	results
}) => {
	const { theme } = useApp();
	const isDark = theme === Theme.DARK;

	// Components for the Pitch Cover Animation
	const PitchCoverLoader = () => (
		<div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#0a0f1e] rounded-xl">
			<div className={`absolute inset-0 transition-opacity duration-700 ${isDark
				? 'bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0a0f1e]'
				: 'bg-gradient-to-b from-slate-200 via-blue-50 to-slate-100'
				}`} />

			<div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />

			<div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
				{[...Array(15)].map((_, i) => (
					<motion.div
						key={i}
						initial={{ y: -100, x: (Math.random() * 100) + '%' }}
						animate={{ y: '120%' }}
						transition={{
							duration: 0.6 + Math.random() * 0.4,
							repeat: Infinity,
							ease: "linear",
							delay: Math.random() * 2
						}}
						className="absolute w-[1px] h-12 bg-blue-400/30 dark:bg-cyan-400/20"
						style={{ left: `${Math.random() * 100}%` }}
					/>
				))}
			</div>

			<div className="relative w-full h-full flex items-center justify-center">
				<motion.div
					initial={{ x: '-110%', y: '-110%', rotate: -10 }}
					animate={{
						x: '-20%',
						y: '-15%',
						skewX: [0, 0.5, 0, -0.5, 0],
						scale: [1, 1.005, 1]
					}}
					transition={{
						x: { duration: 1.5, ease: [0.45, 0, 0.55, 1] },
						y: { duration: 1.5, ease: [0.45, 0, 0.55, 1] },
						skewX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
						scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
					}}
					className="absolute w-[120%] h-[120%] bg-blue-600/10 dark:bg-blue-500/10 border border-blue-400/20 backdrop-blur-[2px] shadow-2xl"
					style={{
						clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0% 100%)',
						background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.15) 100%)'
					}}
				/>

				<motion.div
					initial={{ x: '110%', y: '110%', rotate: -10 }}
					animate={{
						x: '20%',
						y: '15%',
						skewY: [0, -0.5, 0, 0.5, 0],
						scale: [1, 1.008, 1]
					}}
					transition={{
						x: { duration: 1.5, ease: [0.45, 0, 0.55, 1], delay: 0.1 },
						y: { duration: 1.5, ease: [0.45, 0, 0.55, 1], delay: 0.1 },
						skewY: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
						scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
					}}
					className="absolute w-[120%] h-[120%] bg-blue-700/10 dark:bg-blue-400/5 border border-blue-300/15 backdrop-blur-[1px] shadow-xl"
					style={{
						clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
						background: 'linear-gradient(315deg, rgba(29, 78, 216, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%)'
					}}
				/>

				<div className="z-30 text-center px-8 flex flex-col items-center">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						className="space-y-2"
					>
						<motion.h3
							animate={{ opacity: [1, 0.7, 1] }}
							transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
							className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter"
						>
							{message}
						</motion.h3>
						<div className="flex flex-col items-center space-y-1">
							<p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] ml-1">
								Calculating Revised Target...
							</p>
							<div className="flex space-x-1.5 mt-2">
								{[0, 1, 2].map(i => (
									<motion.span
										key={i}
										animate={{ opacity: [0.2, 1, 0.2] }}
										transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
										className="w-1 h-1 bg-emerald-500 rounded-full"
									/>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);

	return (
		<div className={`w-full h-full min-h-[350px] flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${loading
			? 'border-emerald-200 dark:border-emerald-900/30 bg-transparent'
			: 'border-transparent bg-white dark:bg-slate-900 shadow-sm'
			}`}>
			{loading ? (
				<PitchCoverLoader />
			) : (
				<motion.div
					initial={{ opacity: 0, y: 10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 25,
						mass: 1
					}}
					className="w-full space-y-8 py-4 relative"
				>
					{/* Cricket Ball Reveal Animation */}
					<motion.div
						initial={{ x: -100, rotate: -360, opacity: 0 }}
						animate={{ x: 0, rotate: 0, opacity: 1 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20
						}}
						className="flex flex-col items-center text-center space-y-3"
					>
						<div className="relative">
							<div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-700 relative overflow-hidden">
								<div className="absolute inset-0 bg-white/10 rounded-full -rotate-45 translate-x-1" />
								<div className="w-full h-[2px] bg-white/40 absolute top-1/2 -translate-y-1/2" />
								<div className="w-full h-[2px] bg-white/20 absolute top-[40%] -translate-y-1/2" />
								<div className="w-full h-[2px] bg-white/20 absolute top-[60%] -translate-y-1/2" />
							</div>
							<motion.div
								animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="absolute inset-0 bg-red-400 rounded-full blur-md -z-10"
							/>
						</div>

						<div className="space-y-1">
							<h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
								Standard DLS Outcome
							</h3>
							<p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
								{results?.targetScore ? 'Chase Revised' : 'Match Par Result'}
							</p>
						</div>
					</motion.div>

					<div className="grid grid-cols-1 gap-8">
						{results?.parScore !== undefined && (
							<div className="text-center group">
								<p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
									Par Score
								</p>
								<p className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
									<Counter value={results.parScore} />
								</p>
							</div>
						)}

						{results?.targetScore !== undefined && (
							<div className="text-center group">
								<p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">
									Revised Target
								</p>
								<div className="flex flex-col items-center">
									<p className="text-8xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none">
										<Counter value={results.targetScore} />
									</p>
									<div className="mt-2 flex items-center gap-2">
										<span className="w-2 h-[2px] bg-emerald-500/30" />
										<span className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-tighter">Required to Win</span>
										<span className="w-2 h-[2px] bg-emerald-500/30" />
									</div>
								</div>
							</div>
						)}

						{results?.adjustedTotal !== undefined && (
							<div className="pt-6 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
								<p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
									Adj. 1st Innings Total
								</p>
								<p className="text-3xl font-bold text-slate-700 dark:text-slate-300 tracking-tight">
									<Counter value={results.adjustedTotal} />
								</p>
							</div>
						)}
					</div>

					<div className="pt-6 text-center">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1 }}
							className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-3"
						>
							<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
							<span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
								DLS Professional Analytics
							</span>
						</motion.div>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.2 }}
							className="text-[9px] text-slate-400 dark:text-slate-600 max-w-[250px] mx-auto leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3"
						>
							Based on calculations from ICC sources. Not a reflection of the official ICC calculator. G50 resource percentages vary based on current playing standards.
						</motion.p>
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default StadiumLoader;
