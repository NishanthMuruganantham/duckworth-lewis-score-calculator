import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchResourceTable } from '../services/dlsApi';
import { ResourceTableResponse } from '../types';
import { OverLoader } from '../components/ui/OverLoader';
import { WicketError } from '../components/ui/WicketError';
import { FileSpreadsheet, Info } from 'lucide-react';
import SEO from '../components/seo/SEO';
import SEOContent from '../components/seo/SEOContent';

const ResourceTable: React.FC = () => {
	const { matchFormat } = useApp();
	const [data, setData] = useState<ResourceTableResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// SEO Content for this page
	const pageSEO = {
		title: 'DLS Resource Table | Professional Cricket Calculation Reference',
		description: 'View standard DLS resource conversion percentages for ODI, T20, and T10. The primary reference for rain-affected cricket math.',
		canonical: 'https://dls.nishanthm.com/resource-table',
		schema: JSON.stringify([
			{
				"@context": "https://schema.org",
				"@type": "WebApplication",
				"name": "DLS Resource Table Reference",
				"description": "Interactive resource tables for DLS cricket calculations.",
				"applicationCategory": "ReferenceApplication"
			}
		])
	};

	const seoText = {
		title: "DLS Resource Percentage Table",
		description: `The standard DLS resource table is a data-driven model that calculates exactly how much 'potential' a batting team has left based on their current situation. 
        
        In DLS terms, 'resources' are defined as the combination of overs remaining and wickets in hand. This table shows the percentage of resources available at any given point in an innings. For example, at the start of a 50-over match, a team has 100% of their resources. As balls are bowled and wickets fall, this percentage drops towards zero.
        
        Browse our verified reference table to see how DLS constants apply to One Day Internationals (ODI) and T20 matches.`,
		faqs: [
			{
				question: "What does the resource table number mean?",
				answer: "The number in each cell represents the percentage of total resources a team has remaining, given the number of balls left and wickets lost."
			},
			{
				question: "Is the resource table the same for T20 and ODI?",
				answer: "While the principle is the same, different constants (G50) and resource curves are often used to account for the different scoring rates and aggression levels in various formats."
			}
		]
	};

	const loadData = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await fetchResourceTable(matchFormat);
			setData(result);
		} catch (err) {
			setError("Failed to load resource data.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [matchFormat]);

	const renderTable = () => {
		if (!data) return null;

		let columns: string[] = [];
		let rows: any[] = [];

		if ('columns' in data && Array.isArray(data.data)) {
			columns = data.columns;
			rows = data.data;
		} else if (Array.isArray(data)) {
			if (data.length > 0) {
				columns = Object.keys(data[0]);
				rows = data.map(obj => Object.values(obj));
			}
		}

		const wicketNumbers = columns.slice(1).map(col => col.replace(/[^0-9]/g, ''));
		const headerBgMain = "bg-emerald-600 dark:bg-emerald-800";
		const headerBgSub = "bg-emerald-700 dark:bg-emerald-900";
		const headerBorder = "border-emerald-500/50 dark:border-emerald-700/50";

		return (
			<div className="relative overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
				<div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
					<table className="min-w-full border-separate border-spacing-0">
						<thead className="sticky top-0 z-30">
							<tr className={`${headerBgMain} text-white`}>
								<th
									rowSpan={2}
									className={`sticky left-0 z-40 ${headerBgMain} px-6 py-4 text-left border-r ${headerBorder}`}
								>
									<div className="flex flex-col">
										<span className="text-[10px] uppercase tracking-widest font-black text-emerald-400/80 dark:text-slate-500">Resource</span>
										<span className="text-sm font-bold">Balls</span>
									</div>
								</th>
								<th
									colSpan={wicketNumbers.length}
									className={`px-6 py-2 text-center text-[10px] font-black uppercase tracking-[0.4em] border-b ${headerBorder}`}
								>
									Wickets Lost
								</th>
							</tr>
							<tr className={`${headerBgSub} text-white`}>
								{wicketNumbers.map((val, idx) => (
									<th key={idx} className={`px-6 py-3 text-center text-xs font-black border-r ${headerBorder} last:border-r-0`}>
										{val}
									</th>
								))}
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
							{rows.map((row, rIdx) => {
								const oversLeft = row[0];
								const ballsLeft = row[0];
								const values = row.slice(1);

								return (
									<tr key={rIdx} className="group even:bg-slate-50/50 dark:even:bg-slate-800/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
										<td className="sticky left-0 z-20 bg-white dark:bg-slate-900 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 px-6 py-4 border-r border-slate-100 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white transition-colors">
											{ballsLeft}
										</td>
										{values.map((cell: any, cIdx: number) => (
											<td
												key={cIdx}
												className="px-6 py-4 text-center whitespace-nowrap text-xs font-mono text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors border-r border-slate-50 dark:border-slate-800 last:border-r-0"
											>
												{typeof cell === 'number' ? cell.toFixed(1) : cell}
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	return (
		<main className="space-y-6">
			<SEO {...pageSEO} />
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
				<div>
					<div className="flex items-center space-x-2">
						<FileSpreadsheet className="w-5 h-5 text-emerald-600" />
						<h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Analytical Reference</h1>
					</div>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
						G50 Resource Constants for <span className="text-emerald-600 font-bold">{matchFormat}</span>
					</p>
				</div>
			</div>

			<div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 rounded-2xl p-4 flex items-start space-x-3">
				<Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
				<p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed font-medium">
					This table shows the <strong>% resource available</strong> remaining for a chase.
					Rows indicate <strong>Balls Remaining</strong> while columns represent <strong>Wickets Lost</strong>.
				</p>
			</div>

			<div className="min-h-[400px]">
				{loading ? (
					<div className="flex flex-col justify-center items-center h-[400px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
						<OverLoader />
					</div>
				) : error ? (
					<div className="flex justify-center items-center min-h-[400px]">
						<WicketError onRetry={loadData} message={error} />
					</div>
				) : (
					renderTable()
				)}
			</div>

			<div className="flex justify-center opacity-30">
				<div className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em]">
					DLS V5.0 Verified Reference
				</div>
			</div>

			<SEOContent {...seoText} />
		</main>
	);
};

export default ResourceTable;
