import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Info, Timer, Scissors, CloudRain, PlayCircle, Star } from 'lucide-react';
import { AppIcon } from '../components/ui/AppIcon';
import SEO from '../components/seo/SEO';

const Documentation: React.FC = () => {
	// SEO Content for this page
	const pageSEO = {
		title: 'DLS Method Explained | Cricket Duckworth-Lewis-Stern Guide',
		description: 'Learn how the DLS method works in cricket. Detailed guide on rain-adjusted targets, par scores, and official ICC protocols.',
		canonical: 'https://dls.nishanthm.com/how-it-works',
		schema: JSON.stringify([
			{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "What is the DLS method in cricket?",
						"content": "The Duckworth-Lewis-Stern (DLS) method is a mathematical formula used to calculate target scores for the team batting second in limited-overs cricket matches interrupted by weather."
					},
					{
						"@type": "Question",
						"name": "How does DLS calculate par scores?",
						"content": "DLS treats wickets and overs as resources. It calculates how much resource a team has used and has remaining to set a fair, adjusted target score."
					}
				]
			}
		])
	};
	const sections = [
		{
			title: "What is DLS?",
			icon: Star,
			color: "text-amber-500",
			bg: "bg-amber-50 dark:bg-amber-900/20",
			content: "The Duckworth-Lewis-Stern (DLS) method is a mathematical formulation designed to calculate the target score for the team batting second in a limited-overs cricket match interrupted by weather or other circumstances. It treats wickets and overs as resources and calculates how much resource remains to set a fair target."
		},
		{
			title: "1st Innings Interruption",
			icon: PlayCircle,
			color: "text-blue-500",
			bg: "bg-blue-50 dark:bg-blue-900/20",
			scenario: "Rain stops play during the first innings, and overs are reduced before resumption.",
			example: "Team A is 150/2 in 30 overs. Rain reduces the match to 40 overs. Team A bats 10 more overs. Team B's target is adjusted because Team A lost resources they would have used at the death."
		},
		{
			title: "1st Innings Curtailed",
			icon: Scissors,
			color: "text-rose-500",
			bg: "bg-rose-50 dark:bg-rose-900/20",
			scenario: "The first innings ends prematurely due to weather and cannot resume.",
			example: "Team A is 200/5 in 42 overs when rain ends their innings permanently. Team B is given a revised target for 40 overs. The target is usually higher than 200 because Team A had wickets in hand."
		},
		{
			title: "2nd Innings Delayed Start",
			icon: Timer,
			color: "text-emerald-500",
			bg: "bg-emerald-50 dark:bg-emerald-900/20",
			scenario: "The first innings is complete, but the second innings start is delayed, reducing overs.",
			example: "Team A scores 300 in 50 overs. Rain delays start of chase. Match is now 20 overs. Team B's target is revised (usually upwards proportionally) to reflect the aggressive nature of a shorter chase with 10 wickets."
		},
		{
			title: "2nd Innings Interruption",
			icon: CloudRain,
			color: "text-indigo-500",
			bg: "bg-indigo-50 dark:bg-indigo-900/20",
			scenario: "Rain stops play during the chase, and overs are reduced for the remainder of the match.",
			example: "Team B is chasing 250 in 50 overs. At 100/2 in 20 overs, rain stops play. 10 overs are lost. Play resumes as a 40-over match. Target is recalculated for the new 40-over limit."
		},
		{
			title: "2nd Innings Curtailed (Abandonment)",
			icon: Scissors,
			color: "text-slate-500",
			bg: "bg-slate-50 dark:bg-slate-900/20",
			scenario: "Match is abandoned permanently during the chase.",
			example: "Team B is 120/3 in 25 overs chasing 280. Rain ends the match. We look at the 'Par Score' for 25 overs and 3 wickets. If Team B is above that score, they win; otherwise, Team A wins."
		}
	];

	return (
		<main className="space-y-8 pb-12">
			<SEO {...pageSEO} />
			<div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
					<AppIcon size={400} />
				</div>

				<div className="relative z-10">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="inline-flex mb-6"
					>
						<AppIcon className="w-20 h-20 shadow-xl rounded-2xl" size={128} />
					</motion.div>

					<h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">DLS Professional Guide</h1>
					<p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-4 font-medium leading-relaxed">
						The Duckworth-Lewis-Stern method is the global standard for ensuring fair outcomes in weather-interrupted cricket.
						Our calculator implements the latest v5.0 protocols.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{sections.map((section, idx) => (
					<motion.div
						key={idx}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.1 }}
						className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors group"
					>
						<div className="flex items-center space-x-3 mb-4">
							<div className={`p-2 rounded-xl ${section.bg} group-hover:scale-110 transition-transform`}>
								<section.icon className={`w-5 h-5 ${section.color}`} />
							</div>
							<h3 className="font-bold text-slate-800 dark:text-white">{section.title}</h3>
						</div>

						<div className="flex-1 space-y-4">
							{section.content && (
								<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
									{section.content}
								</p>
							)}
							{section.scenario && (
								<div>
									<h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Context</h4>
									<p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{section.scenario}</p>
								</div>
							)}
							{section.example && (
								<div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
									<div className="flex items-center space-x-2 mb-2">
										<Info className="w-3.5 h-3.5 text-blue-500" />
										<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pro Case Study</span>
									</div>
									<p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
										"{section.example}"
									</p>
								</div>
							)}
						</div>
					</motion.div>
				))}
			</div>

			<div className="bg-emerald-600 rounded-2xl p-8 text-white text-center shadow-lg shadow-emerald-600/20 relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
					<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M0 100 L100 0 L100 100 Z" fill="white" />
					</svg>
				</div>
				<div className="relative z-10">
					<h3 className="text-xl font-bold mb-2 tracking-tight">Need more technical details?</h3>
					<p className="text-emerald-100 text-sm mb-6 max-w-md mx-auto">
						Our calculator uses the DLS v5.0 implementation, aligned with official ICC international match standards.
					</p>
					<button
						onClick={() => window.open('https://en.wikipedia.org/wiki/Duckworth%E2%80%93Lewis%E2%80%93Stern_method', '_blank')}
						className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md"
					>
						View Full ICC Specification
					</button>
				</div>
			</div>
		</main>
	);
};

export default Documentation;
