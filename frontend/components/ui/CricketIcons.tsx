import React from 'react';
import { MdSportsCricket } from 'react-icons/md';
import { TbTargetArrow, TbCloudRain, TbClock, TbHandStop } from 'react-icons/tb';

interface IconProps {
	className?: string;
}

// Helper to cast icons to any to avoid strict React 19 type mismatch
const MdBat = MdSportsCricket as React.ComponentType<any>;
const TbTarget = TbTargetArrow as React.ComponentType<any>;
const TbCloud = TbCloudRain as React.ComponentType<any>;
const TbClockIcon = TbClock as React.ComponentType<any>;
const TbStop = TbHandStop as React.ComponentType<any>;

export const IconHome: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<path
			d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10Z"
			className="fill-emerald-600/10 stroke-emerald-600 dark:stroke-emerald-400"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<circle cx="12" cy="12" r="2" className="fill-emerald-600 dark:fill-emerald-400" />
	</svg>
);

// 1. First Innings Interrupted (Bat + Cloud)
export const IconInn1Interrupted: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<div className={`relative ${className} flex items-center justify-center`}>
		<MdBat className="w-full h-full text-emerald-600 dark:text-emerald-400" />
		<div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-[1px]">
			<TbCloud className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
		</div>
	</div>
);

// 2. First Innings Curtailed (Bat + Stop)
export const IconInn1Curtailed: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<div className={`relative ${className} flex items-center justify-center`}>
		<MdBat className="w-full h-full text-emerald-600 dark:text-emerald-400" />
		<div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-[1px]">
			<TbStop className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
		</div>
	</div>
);

// 3. Second Innings Delayed (Target + Clock)
export const IconInn2Delayed: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<div className={`relative ${className} flex items-center justify-center`}>
		<TbTarget className="w-full h-full text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
		<div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-[1px]">
			<TbClockIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
		</div>
	</div>
);

// 4. Second Innings Interrupted (Target + Cloud)
export const IconInn2Interrupted: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<div className={`relative ${className} flex items-center justify-center`}>
		<TbTarget className="w-full h-full text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
		<div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-[1px]">
			<TbCloud className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
		</div>
	</div>
);

// 5. Second Innings Curtailed (Target + Stop)
export const IconInn2Curtailed: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
	<div className={`relative ${className} flex items-center justify-center`}>
		<TbTarget className="w-full h-full text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
		<div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-[1px]">
			<TbStop className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
		</div>
	</div>
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
