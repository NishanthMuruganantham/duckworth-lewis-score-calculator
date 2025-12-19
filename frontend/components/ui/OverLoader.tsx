import React from 'react';

export const OverLoader: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full py-16 space-y-8 select-none">
			<div className="flex items-center space-x-3 sm:space-x-4">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-300 dark:text-slate-700 over-ball"
						style={{
							animationDelay: `${i * 0.15}s`,
						}}
					/>
				))}
			</div>

			<div className="text-center flex flex-col items-center space-y-1">
				<span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
					Updating Resource Data
				</span>
				<div className="flex items-center space-x-2">
					<span className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
					<span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-tighter">
						Analytical Sync in Progress
					</span>
					<span className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
				</div>
			</div>

			<style>{`
        .over-ball {
			animation: overProgress 2.2s infinite ease-in-out both;
        }
        @keyframes overProgress {
			0%, 10% {
				background-color: transparent;
				border-color: currentColor;
				transform: scale(1);
			}
			20%, 80% {
				background-color: #059669;
				border-color: #059669;
				transform: scale(1.05);
			}
			90%, 100% {
				background-color: transparent;
				border-color: currentColor;
				transform: scale(1);
			}
		}
		@media (prefers-reduced-motion: reduce) {
			.over-ball {
				animation: none;
				background-color: #059669;
				border-color: #059669;
			}
		}
		`}</style>
		</div>
	);
};
