
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, Menu } from 'lucide-react';
import { MatchFormat } from '../../types';
import { BrandLogo } from '../ui/BrandLogo';

interface HeaderProps {
	onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
	const { theme, toggleTheme, matchFormat, setMatchFormat } = useApp();

	const cycleFormat = () => {
		const formats = Object.values(MatchFormat);
		const currentIndex = formats.indexOf(matchFormat);
		const nextFormat = formats[(currentIndex + 1) % formats.length];
		setMatchFormat(nextFormat);
	};

	return (
		<header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
			{/* Left: Hamburger Menu */}
			<div className="flex items-center">
				<button
					onClick={onMenuClick}
					className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors md:hidden"
					aria-label="Open Menu"
				>
					<Menu className="w-6 h-6" />
				</button>
			</div>

			{/* Center: Title with Logo */}
			<div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none flex items-center space-x-2">
				<BrandLogo className="w-6 h-6" />
				<h1 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-tight whitespace-nowrap">
					DLS<span className="text-slate-700 dark:text-white"> Calculator</span>
				</h1>
			</div>

			{/* Right: Actions */}
			<div className="flex items-center space-x-2 sm:space-x-3 z-10">

				{/* Match Format Toggle: Desktop */}
				<div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
					{Object.values(MatchFormat).map((fmt) => (
						<button
							key={fmt}
							onClick={() => setMatchFormat(fmt)}
							className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors duration-200 ${matchFormat === fmt
								? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
								: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
								}`}
						>
							{fmt}
						</button>
					))}
				</div>

				{/* Match Format Toggle: Mobile */}
				<button
					onClick={cycleFormat}
					className="flex sm:hidden items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
				>
					{matchFormat}
				</button>

				{/* Theme Toggle */}
				<button
					onClick={toggleTheme}
					className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
					aria-label="Toggle Theme"
				>
					{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
				</button>
			</div>
		</header>
	);
};

export default Header;
