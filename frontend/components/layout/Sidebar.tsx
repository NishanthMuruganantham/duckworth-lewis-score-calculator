import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MatchFormat } from '../../types';
import { BrandLogo } from '../ui/BrandLogo';
import {
	IconInn1Interrupted,
	IconInn1Curtailed,
	IconInn2Delayed,
	IconInn2Interrupted,
	IconInn2Curtailed,
	IconResources,
	IconDocs,
	IconHome
} from '../ui/CricketIcons';
import { AlertTriangle } from 'lucide-react';

const Sidebar: React.FC = () => {
	const { matchFormat, setMatchFormat } = useApp();

	const navItems = [
		{ to: '/', label: 'Dashboard', icon: IconHome },
		{ to: '/interrupted-first-innings', label: '1st Inn Resume', icon: IconInn1Interrupted },
		{ to: '/curtailed-first-innings', label: '1st Inn Cut', icon: IconInn1Curtailed },
		{ to: '/delayed-second-innings', label: '2nd Inn Delayed', icon: IconInn2Delayed },
		{ to: '/interrupted-second-innings', label: '2nd Inn Resume', icon: IconInn2Interrupted },
		{ to: '/curtailed-second-innings', label: '2nd Inn Cut', icon: IconInn2Curtailed },
	];

	return (
		<aside className="hidden md:flex flex-col w-64 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0">
			<div className="p-6 border-b border-slate-200 dark:border-slate-800">
				<div className="flex items-center space-x-3 mb-1">
					<BrandLogo className="w-8 h-8 shadow-sm rounded-full" />
					<h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
						DLS<span className="text-slate-700 dark:text-white"> Calculator</span>
					</h1>
				</div>
				<p className="text-xs text-slate-500 dark:text-slate-400 ml-1">Professional Analytics</p>
			</div>

			<div className="px-4 py-4">
				<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Match Format</h3>
				<div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
					{Object.values(MatchFormat).map((fmt) => (
						<button
							key={fmt}
							onClick={() => setMatchFormat(fmt)}
							className={`flex-1 px-2 py-1.5 text-xs font-bold rounded-md transition-colors duration-200 ${matchFormat === fmt
								? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
								: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
								}`}
						>
							{fmt}
						</button>
					))}
				</div>
			</div>

			<nav className="flex-1 px-4 space-y-1 overflow-y-auto">
				<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2 px-2">Scenarios</h3>
				{navItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors duration-200 group ${isActive
								? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none'
								: 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
								<span className="font-medium text-sm flex-1">{item.label}</span>
								{isActive && (
									<motion.div
										layoutId="sidebarActive"
										className="w-1 h-1 rounded-full bg-white dark:bg-emerald-400"
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
									/>
								)}
							</>
						)}
					</NavLink>
				))}

				<div className="pt-4 pb-2">
					<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Resources</h3>
					<NavLink
						to="/resource-table"
						className={({ isActive }) =>
							`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors duration-200 group ${isActive
								? 'bg-emerald-600 text-white shadow-md'
								: 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<IconResources className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
								<span className="font-medium text-sm flex-1">Resource Table</span>
								{isActive && (
									<motion.div
										layoutId="sidebarActive"
										className="w-1 h-1 rounded-full bg-white dark:bg-emerald-400"
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
									/>
								)}
							</>
						)}
					</NavLink>

					<NavLink
						to="/how-it-works"
						className={({ isActive }) =>
							`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors duration-200 mt-1 group ${isActive
								? 'bg-emerald-600 text-white shadow-md'
								: 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<IconDocs className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
								<span className="font-medium text-sm flex-1">Documentation</span>
								{isActive && (
									<motion.div
										layoutId="sidebarActive"
										className="w-1 h-1 rounded-full bg-white dark:bg-emerald-400"
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
									/>
								)}
							</>
						)}
					</NavLink>

					<NavLink
						to="/disclaimer"
						className={({ isActive }) =>
							`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors duration-200 mt-1 group ${isActive
								? 'bg-emerald-600 text-white shadow-md'
								: 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<AlertTriangle className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
								<span className="font-medium text-sm flex-1">Disclaimer</span>
								{isActive && (
									<motion.div
										layoutId="sidebarActive"
										className="w-1 h-1 rounded-full bg-white dark:bg-emerald-400"
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
									/>
								)}
							</>
						)}
					</NavLink>

					<NavLink
						to="/privacy-policy"
						className={({ isActive }) =>
							`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors duration-200 mt-1 group ${isActive
								? 'bg-emerald-600 text-white shadow-md'
								: 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<svg className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
								<span className="font-medium text-sm flex-1">Privacy Policy</span>
								{isActive && (
									<motion.div
										layoutId="sidebarActive"
										className="w-1 h-1 rounded-full bg-white dark:bg-emerald-400"
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
									/>
								)}
							</>
						)}
					</NavLink>
				</div>
			</nav>

			<div className="p-4 border-t border-slate-200 dark:border-slate-800">
				<div className="bg-emerald-50 dark:bg-slate-800 p-3 rounded-lg border border-emerald-100 dark:border-slate-700 text-center">

					<p className="text-[10px] text-emerald-600 dark:text-emerald-400">
						Designed & Developed by
						<span className="block font-medium mt-0.5">Nishanth</span>
					</p>
				</div>
			</div>
		</aside >
	);
};

export default Sidebar;
