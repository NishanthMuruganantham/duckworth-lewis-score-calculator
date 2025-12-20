import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchResourceTable } from '../services/dlsApi';
import { ResourceTableResponse, MatchFormat } from '../types';
import { OverLoader } from '../components/ui/OverLoader';
import { WicketError } from '../components/ui/WicketError';
import { FileSpreadsheet, Info } from 'lucide-react';

const ResourceTable: React.FC = () => {
	const { matchFormat } = useApp();
	const [data, setData] = useState<ResourceTableResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadData = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await fetchResourceTable(matchFormat);
			setData(result);
		} catch (err) {
			setError("Failed to load official resource data.");
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
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
				<div>
					<div className="flex items-center space-x-2">
						<FileSpreadsheet className="w-5 h-5 text-emerald-600" />
						<h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Analytical Reference</h2>
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
		</div>
	);
};

export default ResourceTable;
