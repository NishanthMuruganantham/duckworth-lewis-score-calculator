import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
	className?: string;
}

// 1. First Innings Interrupted
export const IconInn1Interrupted: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		{/* Cloud Background */}
		<path d="M17.5 19C19.9 19 22 16.9 22 14.5C22 12.1 19.9 10 17.5 10C17.3 10 17.1 10 16.9 10.1C15.9 7.2 13.2 5 10 5C6.1 5 3 8.1 3 12C3 12.1 3 12.2 3 12.3C1.3 13.1 0 14.9 0 17C0 20.3 2.7 23 6 23H17.5" className="fill-emerald-600/10 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
		{/* Play / Resume Arrow */}
		<path d="M10 13L14 16L10 19V13Z" className="fill-emerald-600 dark:fill-emerald-400" />
		<path d="M6 9L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

// 2. First Innings Curtailed
export const IconInn1Curtailed: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		{/* Bat Silhouette */}
		<rect x="10" y="4" width="4" height="16" rx="1" className="fill-emerald-600/20" />
		{/* "Cut" Line */}
		<motion.path
			initial={{ pathLength: 0 }}
			animate={{ pathLength: 1 }}
			d="M4 12L20 12"
			stroke="#ef4444"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeDasharray="4 4"
		/>
		<path d="M7 8L17 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
	</svg>
);

// 3. Second Innings Delayed
export const IconInn2Delayed: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		{/* Clock Circle */}
		<circle cx="12" cy="12" r="9" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
		{/* Clock Hands */}
		<path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		{/* Target Indicator */}
		<circle cx="18" cy="6" r="3" className="fill-emerald-600 dark:fill-emerald-400 shadow-sm" />
	</svg>
);

// 4. Second Innings Interrupted
export const IconInn2Interrupted: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		{/* Rain Cloud */}
		<path d="M17.5 14C19.9 14 22 11.9 22 9.5C22 7.1 19.9 5 17.5 5C17.3 5 17.1 5 16.9 5.1C15.9 2.2 13.2 0 10 0C6.1 0 3 3.1 3 7C3 7.1 3 7.2 3 7.3C1.3 8.1 0 9.9 0 12C0 15.3 2.7 18 6 18H17.5" className="fill-emerald-600/10 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
		{/* Rain Drops */}
		<path d="M8 19L7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M12 19L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M16 19L15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		{/* Target Path Arrow */}
		<path d="M13 13H20M20 13L17 10M20 13L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400" />
	</svg>
);

// 5. Second Innings Curtailed
export const IconInn2Curtailed: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		{/* Abandoned / Stop Sign */}
		<path d="M12 2L22 12L12 22L2 12L12 2Z" className="stroke-red-500" strokeWidth="2" strokeLinejoin="round" />
		<path d="M8 12H16" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
		{/* Result / Scoreboard Marker */}
		<rect x="10" y="8" width="4" height="8" rx="0.5" className="fill-emerald-600/30" />
		<circle cx="12" cy="12" r="1.5" className="fill-emerald-600 dark:fill-emerald-400" />
	</svg>
);

export const IconResources: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<rect x="4" y="14" width="3" height="6" rx="1" className="fill-emerald-600/40" />
		<rect x="10" y="8" width="3" height="12" rx="1" className="fill-emerald-600/70" />
		<rect x="16" y="4" width="3" height="16" rx="1" className="fill-emerald-600" />
	</svg>
);

export const IconDocs: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" className="fill-emerald-600/10 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />
		<path d="M8 7H16M8 11H16M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		<circle cx="16" cy="16" r="2" className="fill-emerald-600 dark:fill-emerald-400" />
	</svg>
);
