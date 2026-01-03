import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDLS } from '../services/dlsApi';
import { ScenarioType, MatchFormat } from '../types';
import StadiumLoader from '../components/ui/StadiumLoader';
import { WicketError } from '../components/ui/WicketError';
import { ConnectionError } from '../components/ui/ConnectionError';
import { HelpCircle, X, ArrowRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconInn2Delayed } from '../components/ui/CricketIcons';

interface FormState {
	overs_available_to_team_1_at_start: number | '';
	runs_scored_by_team_1: number | '';
	overs_available_to_team_2_at_start: number | '';
}
import SEO from '../components/seo/SEO';
import SEOContent from '../components/seo/SEOContent';

const DelayedSecondInnings: React.FC = () => {
	const { matchFormat, setIsCalculating } = useApp();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [apiError, setApiError] = useState<string | null>(null);
	const [isConnError, setIsConnError] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// SEO Content for this page
	const pageSEO = {
		title: 'Delayed Second Innings DLS Target Calculator',
		description: 'Calculate adjusted DLS targets when the second innings start is delayed. Professional tool for accurate cricket match results.',
		canonical: 'https://dls.nishanthm.com/delayed-second-innings',
		schema: JSON.stringify([
			{
				"@context": "https://schema.org",
				"@type": "WebApplication",
				"name": "Delayed 2nd Innings DLS Calculator",
				"description": "Calculate revised targets for delayed second innings in cricket.",
				"applicationCategory": "SportsApplication"
			}
		])
	};

	const seoText = {
		title: "Delayed Second Innings",
		description: `A delayed second innings happens when the chase is shortened before a single ball is bowled. This usually occurs due to rain during the innings break. 
        
        Since Team 2 will have fewer overs but all 10 wickets intact, the DLS method often sets a target that is higher than the original pro-rata score. This accounts for the fact that a team can bat much more aggressively when they know they have fewer overs to face with full resource.
        
        Our DLS calculator precisely determines these revised targets for ODI, T20, and T10 matches.`,
		faqs: [
			{
				question: "Why does the target go up in a delayed start?",
				answer: "The target increases because the chasing team has the advantage of knowing they have fewer overs to face with all 10 wickets, allowing for a higher scoring rate."
			},
			{
				question: "What is the minimum number of overs for a DLS result?",
				answer: "In most international T20s, at least 5 overs must be bowled to each side. In ODIs, it's typically 20 overs per side."
			}
		]
	};

	const [formData, setFormData] = useState<FormState>({
		overs_available_to_team_1_at_start: '',
		runs_scored_by_team_1: '',
		overs_available_to_team_2_at_start: '',
	});

	useEffect(() => {
		setResult(null);
		setApiError(null);
		setIsConnError(false);
		validateForm(formData);
	}, [matchFormat]);

	const scrollToHelp = () => {
		const element = document.getElementById('how-it-works');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const getMaxOvers = () => {
		switch (matchFormat) {
			case MatchFormat.T10: return 10;
			case MatchFormat.T20: return 20;
			case MatchFormat.ODI: return 50;
			default: return 50;
		}
	};

	const validateOvers = (val: number | string): boolean => {
		if (val === '') return true;
		const num = Number(val);
		const decimal = Number((num % 1).toFixed(1));
		return decimal <= 0.5;
	};

	const validateForm = (data: FormState) => {
		const newErrors: Record<string, string> = {};
		const maxOvers = getMaxOvers();

		if (data.overs_available_to_team_1_at_start !== '') {
			const t1 = Number(data.overs_available_to_team_1_at_start);
			if (!validateOvers(data.overs_available_to_team_1_at_start)) {
				newErrors.overs_available_to_team_1_at_start = "Invalid format. Balls must be .0 to .5";
			} else if (t1 > maxOvers) {
				newErrors.overs_available_to_team_1_at_start = `Cannot exceed ${maxOvers} overs in ${matchFormat}`;
			}
		}

		if (data.runs_scored_by_team_1 !== '' && Number(data.runs_scored_by_team_1) < 0) {
			newErrors.runs_scored_by_team_1 = "Runs cannot be negative";
		}

		if (data.overs_available_to_team_2_at_start !== '') {
			const t2 = Number(data.overs_available_to_team_2_at_start);
			const t1 = Number(data.overs_available_to_team_1_at_start);
			if (!validateOvers(data.overs_available_to_team_2_at_start)) {
				newErrors.overs_available_to_team_2_at_start = "Invalid format. Balls must be .0 to .5";
			} else if (t2 > maxOvers) {
				newErrors.overs_available_to_team_2_at_start = `Cannot exceed ${maxOvers} overs in ${matchFormat}`;
			} else if (t2 <= 0) {
				newErrors.overs_available_to_team_2_at_start = "Overs must be greater than 0";
			}
			if (data.overs_available_to_team_1_at_start !== '' && t2 > t1) {
				newErrors.overs_available_to_team_2_at_start = "Team 2 overs cannot exceed Team 1 overs";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
			const newData = { ...formData, [name]: value };
			setFormData(newData);
			validateForm(newData);
		}
	};

	const handleClearForm = () => {
		setFormData({
			overs_available_to_team_1_at_start: '',
			runs_scored_by_team_1: '',
			overs_available_to_team_2_at_start: '',
		});
		setApiError(null);
		setIsConnError(false);
		setResult(null);
		setErrors({});
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!validateForm(formData)) return;
		setLoading(true);
		setIsCalculating(true);
		setApiError(null);
		setIsConnError(false);
		setResult(null);

		const payload = {
			scenario_type: ScenarioType.DELAYED_INN_2,
			match_format: matchFormat,
			inputs: {
				overs_available_to_team_1_at_start: Number(formData.overs_available_to_team_1_at_start),
				runs_scored_by_team_1: Number(formData.runs_scored_by_team_1),
				overs_available_to_team_2_at_start: Number(formData.overs_available_to_team_2_at_start),
			},
		};

		try {
			const response = await calculateDLS(payload);
			if (response.success && response.data) {
				setResult(response.data);
			} else {
				if (response.error === 'CONNECTIVITY_ERROR') {
					setIsConnError(true);
				} else {
					setApiError(response.error || "Calculation failed");
				}
			}
		} catch (err) {
			setIsConnError(true);
		} finally {
			setLoading(false);
			setIsCalculating(false);
		}
	};

	const hasErrors = Object.keys(errors).length > 0;
	const isFormComplete = formData.overs_available_to_team_1_at_start !== '' && formData.runs_scored_by_team_1 !== '' && formData.overs_available_to_team_2_at_start !== '';

	const inputBaseClass = "w-full px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20 focus:scale-[1.01]";

	const getInputBorderClass = (field: string) => {
		if (errors[field]) return "border-red-500 focus:border-red-500 dark:border-red-900 focus:ring-red-500/10";
		return "border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500";
	};

	return (
		<main className="space-y-6">
			<SEO {...pageSEO} />
			<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
				<div className="flex items-start justify-between">
					<div className="flex items-start space-x-4">
						<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
							<div className="w-6 h-6 flex items-center justify-center"><IconInn2Delayed className="w-6 h-6" /></div>
						</div>
						<div>
							<div className="flex items-center space-x-2">
								<h1 className="text-xl font-bold text-slate-800 dark:text-white">2nd Innings – Delayed Start</h1>
								<button
									onClick={scrollToHelp}
									className="p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
									title="How this works"
								>
									<HelpCircle className="w-4 h-4" />
								</button>
							</div>
							<p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
								Calculate the revised target when the 2nd innings start is delayed.
								Format: <span className="font-bold text-emerald-600">{matchFormat} ({getMaxOvers()} overs max)</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4 md:col-span-2">
								<div className="flex items-center space-x-2 mb-3">
									<div className="w-[2px] h-4 bg-emerald-500 rounded-full" />
									<h3 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">Team 1 (Completed Innings)</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Runs Scored</label>
										<input type="number" name="runs_scored_by_team_1" value={formData.runs_scored_by_team_1} onChange={handleInputChange} aria-label="Team 1 Runs Scored" className={`${inputBaseClass} ${getInputBorderClass('runs_scored_by_team_1')}`} placeholder="e.g., 250" inputMode="decimal" required />
										{errors.runs_scored_by_team_1 && <p className="text-xs text-red-500 mt-1">{errors.runs_scored_by_team_1}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Overs Played/Allocated</label>
										<input type="number" step="0.1" name="overs_available_to_team_1_at_start" value={formData.overs_available_to_team_1_at_start} onChange={handleInputChange} aria-label="Team 1 Total Overs" className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_1_at_start')}`} placeholder={`Max ${getMaxOvers()} Overs`} inputMode="decimal" required />
										{errors.overs_available_to_team_1_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_1_at_start}</p>}
									</div>
								</div>
							</div>
							<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
							<div className="space-y-4 md:col-span-2">
								<div className="flex items-center space-x-2 mb-3">
									<div className="w-[2px] h-4 bg-emerald-500 rounded-full" />
									<h3 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">Team 2 (Revised Conditions)</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revised Overs Allocated</label>
										<input type="number" step="0.1" name="overs_available_to_team_2_at_start" value={formData.overs_available_to_team_2_at_start} onChange={handleInputChange} aria-label="Revised Overs Allocated" className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_2_at_start')}`} placeholder={`Max ${getMaxOvers()} Overs`} inputMode="decimal" required />
										{errors.overs_available_to_team_2_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_2_at_start}</p>}
									</div>
								</div>
							</div>
						</div>
						<div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
							<button type="submit" disabled={loading || hasErrors || !isFormComplete} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform disabled:opacity-50">
								<Save className="w-5 h-5" />
								<span>Calculate Target</span>
							</button>
						</div>
					</form>
				</div>
				<div className="lg:col-span-1 relative min-h-[350px]">
					<AnimatePresence mode="wait">
						{loading ? (
							<StadiumLoader key="loader" message="Calculating Target Score" loading={true} />
						) : isConnError ? (
							<ConnectionError key="conn-error" onRetry={() => handleSubmit()} />
						) : apiError ? (
							<WicketError key="error" onRetry={() => handleSubmit()} onBack={handleClearForm} message={apiError} />
						) : result ? (
							<StadiumLoader
								key="result"
								loading={false}
								results={{
									targetScore: result.revisedTarget,
									adjustedTotal: result.parScore
								}}
							/>
						) : (
							<div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
								<ArrowRight className="w-6 h-6 text-slate-400 mb-2" />
								<p className="text-sm">Enter match parameters to calculate target.</p>
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<SEOContent id="how-it-works" {...seoText} />
		</main>
	);
};

export default DelayedSecondInnings;
