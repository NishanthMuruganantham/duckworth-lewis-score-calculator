import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { useApp } from '../../context/AppContext';
import { MatchFormat } from '../../types';
import {
	X,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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

const Layout: React.FC = () => {
	const { matchFormat, setMatchFormat } = useApp();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isResourceOpen, setIsResourceOpen] = useState(false);
	const navigate = useNavigate();

	const handleNavClick = (path: string) => {
		navigate(path);
		setIsDrawerOpen(false);
	};

	const handleResourceClick = (format: MatchFormat) => {
		setMatchFormat(format);
		navigate('/resources');
		setIsDrawerOpen(false);
	};

	const navItems = [
		{ to: '/', label: 'Home', icon: IconHome },
		{ to: '/interrupted-first-innings', label: '1st Innings Interrupted', icon: IconInn1Interrupted },
		{ to: '/curtailed-first-innings', label: '1st Innings Curtailed', icon: IconInn1Curtailed },
		{ to: '/delayed-second-innings', label: '2nd Innings Delayed', icon: IconInn2Delayed },
		{ to: '/interrupted-second-innings', label: '2nd Innings Interrupted', icon: IconInn2Interrupted },
		{ to: '/curtailed-second-innings', label: '2nd Innings Curtailed', icon: IconInn2Curtailed },
	];

	return (
		<div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
			<Sidebar />

			<div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
				<Header onMenuClick={() => setIsDrawerOpen(true)} />

				{/* Main Content Area */}
				<main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
					<div className="max-w-4xl mx-auto">
						<Outlet />
					</div>
				</main>

				{/* Mobile Bottom Navigation */}
				<BottomNav />
			</div>

			{/* Mobile Drawer (Overlay) */}
			<AnimatePresence>
				{isDrawerOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsDrawerOpen(false)}
							className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
						/>

						{/* Drawer Content */}
						<motion.div
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed top-0 bottom-0 left-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-y-auto"
						>
							{/* Drawer Header */}
							<div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
								<div className="flex items-center space-x-2">
									<BrandLogo className="w-8 h-8" />
									<span className="font-bold text-lg text-slate-800 dark:text-white">DLS Calculator</span>
								</div>
								<button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
									<X className="w-6 h-6 text-slate-500" />
								</button>
							</div>

							<div className="p-4 space-y-6 flex-1">
								{/* 1. Scenario Links */}
								<div className="space-y-1">
									<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Scenarios</h3>
									{navItems.map((item) => (
										<NavLink
											key={item.to}
											to={item.to}
											onClick={() => setIsDrawerOpen(false)}
											className={({ isActive }) =>
												`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
													? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
													: 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
												}`
											}
										>
											<item.icon className="w-5 h-5" />
											<span className="text-sm">{item.label}</span>
										</NavLink>
									))}
								</div>

								{/* 2. Match Format Toggle */}
								<div>
									<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Match Format</h3>
									<div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 gap-1">
										{Object.values(MatchFormat).map((fmt) => (
											<button
												key={fmt}
												onClick={() => setMatchFormat(fmt)}
												className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${matchFormat === fmt
													? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-600'
													: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
													}`}
											>
												{fmt}
											</button>
										))}
									</div>
								</div>

								{/* 3. Resource Table Dropdown */}
								<div>
									<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Resources</h3>
									<div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-2">
										<button
											onClick={() => setIsResourceOpen(!isResourceOpen)}
											className="flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
										>
											<div className="flex items-center space-x-3">
												<IconResources className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
												<span className="font-medium text-slate-700 dark:text-slate-200">Resource Tables</span>
											</div>
											{isResourceOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
										</button>

										<AnimatePresence>
											{isResourceOpen && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: 'auto', opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
												>
													<div className="p-2 space-y-1">
														{Object.values(MatchFormat).map((fmt) => (
															<button
																key={fmt}
																onClick={() => handleResourceClick(fmt)}
																className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between group"
															>
																<span>{fmt} Table</span>
																<span className="opacity-0 group-hover:opacity-100 text-emerald-500 text-xs">View</span>
															</button>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>

									<NavLink
										to="/docs"
										onClick={() => setIsDrawerOpen(false)}
										className={({ isActive }) =>
											`flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-200 ${isActive
												? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
												: 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
											}`
										}
									>
										<IconDocs className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
										<span className="font-medium">Documentation</span>
									</NavLink>

									<NavLink
										to="/disclaimer"
										onClick={() => setIsDrawerOpen(false)}
										className={({ isActive }) =>
											`flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-200 mt-2 ${isActive
												? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
												: 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
											}`
										}
									>
										<AlertTriangle className="w-5 h-5 text-amber-500" />
										<span className="font-medium">Disclaimer</span>
									</NavLink>

									<NavLink
										to="/privacy-policy"
										onClick={() => setIsDrawerOpen(false)}
										className={({ isActive }) =>
											`flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-200 mt-2 ${isActive
												? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
												: 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
											}`
										}
									>
										<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
										<span className="font-medium">Privacy Policy</span>
									</NavLink>
								</div>
							</div>

							<div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
								<div className="px-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
									<p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
										Developed with <span className="text-red-500">❤️</span> by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Nishanth Muruganantham</span>
									</p>
									<p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
										Version 4.0 • Built for the Cricket Community
									</p>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Layout;
