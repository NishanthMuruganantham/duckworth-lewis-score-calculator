import React from 'react';
import { NavLink } from 'react-router-dom';
import {
	IconInn1Interrupted,
	IconInn1Curtailed,
	IconInn2Delayed,
	IconInn2Interrupted,
	IconInn2Curtailed
} from '../ui/CricketIcons';

const BottomNav: React.FC = () => {
	const navItems = [
		{ to: '/interrupted-first-innings', label: 'Ings 1 Interup', icon: IconInn1Interrupted },
		{ to: '/curtailed-first-innings', label: 'Ings 1 Cutoff', icon: IconInn1Curtailed },
		{ to: '/delayed-second-innings', label: 'Ings 2 Delay', icon: IconInn2Delayed },
		{ to: '/interrupted-second-innings', label: 'Ings 2 Interup', icon: IconInn2Interrupted },
		{ to: '/curtailed-second-innings', label: 'Ings 2 Cutoff', icon: IconInn2Curtailed },
	];

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe z-50 transition-all duration-300">
			<div className="flex justify-around items-center h-16 px-1">
				{navItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 active:scale-95 ${isActive
								? 'text-emerald-600 dark:text-emerald-400'
								: 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<item.icon
									className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`}
								/>
								<span className={`text-[8px] sm:text-[10px] font-bold leading-none text-center px-1 ${isActive ? '' : 'opacity-80'}`}>
									{item.label}
								</span>
								{isActive && (
									<span className="absolute bottom-1 w-1 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
								)}
							</>
						)}
					</NavLink>
				))}
			</div>
		</div>
	);
};

export default BottomNav;
