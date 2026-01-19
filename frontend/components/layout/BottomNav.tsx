import React from 'react';
import { NavLink } from 'react-router-dom';
import {
	IconInn1Interrupted,
	IconInn1Curtailed,
	IconInn2Delayed,
	IconInn2Interrupted,
	IconInn2Curtailed,
	IconHome
} from '../ui/CricketIcons';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
	const navItems = [
		{ to: '/', label: 'Home', icon: IconHome },
		{ to: '/interrupted-first-innings', label: '1st Inngs Interrupted', icon: IconInn1Interrupted },
		{ to: '/curtailed-first-innings', label: '1st Inngs Cutshort', icon: IconInn1Curtailed },
		{ to: '/delayed-second-innings', label: '2nd Inngs Delay', icon: IconInn2Delayed },
		{ to: '/interrupted-second-innings', label: '2nd Inngs Interrupted', icon: IconInn2Interrupted },
		{ to: '/curtailed-second-innings', label: '2nd Inngs Cutshort', icon: IconInn2Curtailed },
	];

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 transition-all duration-300">
			<div className="flex justify-around items-stretch min-h-[3.75rem] px-0.5 pb-safe-nav">
				{navItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							`flex flex-col items-center justify-center flex-1 min-w-0 py-1 space-y-0 transition-all duration-200 active:scale-90 ${isActive
								? 'text-emerald-600 dark:text-emerald-400'
								: 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<div className="relative p-0.5">
									<item.icon
										className={`w-[18px] h-[18px] sm:w-5 sm:h-5 transition-transform duration-300 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-2'}`}
									/>
									{isActive && (
										<motion.span
											layoutId="nav-dot"
											className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
											transition={{ type: "spring", stiffness: 300, damping: 30 }}
										/>
									)}
								</div>
								<span className={`text-[8px] xs:text-[8.5px] sm:text-[9.5px] font-bold leading-tight text-center px-0.5 break-words max-w-full ${isActive ? 'opacity-100' : 'opacity-70'}`}>
									{item.label}
								</span>
							</>
						)}
					</NavLink>
				))}
			</div>
		</div>
	);
};

export default BottomNav;
