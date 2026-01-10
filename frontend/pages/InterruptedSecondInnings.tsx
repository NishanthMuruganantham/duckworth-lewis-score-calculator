import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDLS } from '../services/dlsApi';
import { ScenarioType, MatchFormat } from '../types';
import StadiumLoader from '../components/ui/StadiumLoader';
import { WicketError } from '../components/ui/WicketError';
import { ConnectionError } from '../components/ui/ConnectionError';
import { HelpCircle, X, ArrowRight, Save, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconInn2Interrupted } from '../components/ui/CricketIcons';

interface FormState {
	runs_scored_by_team_1: number | '';
	overs_available_to_team_1_at_start: number | '';
	overs_available_to_team_2_at_start: number | '';
	overs_used_by_team_2_during_interruption: number | '';
	wickets_lost_by_team_2_during_interruption: number | '';
	revised_overs_to_team_2_after_resumption: number | '';
}
import SEO from '../components/seo/SEO';
import SEOContent from '../components/seo/SEOContent';

const InterruptedSecondInnings: React.FC = () => {
	const { matchFormat, setIsCalculating } = useApp();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [apiError, setApiError] = useState<string | null>(null);
	const [isConnError, setIsConnError] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// SEO Content for this page
	const pageSEO = {
		title: 'Interrupted Second Innings Chase Calculator',
		description: 'Calculate DLS par scores and revised targets when rain stops play during the second innings chase. Essential for ODI and T20 cricket matches.',
		canonical: 'https://dls.nishanthm.com/interrupted-second-innings',
		schema: JSON.stringify([
			{
				"@context": "https://schema.org",
				"@type": "WebApplication",
				"name": "Interrupted 2nd Innings DLS Calculator",
				"description": "Calculate revised targets for interrupted cricket matches.",
				"applicationCategory": "SportsApplication"
			},
			{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "How is the DLS par score calculated during a chase?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "The par score depends on the number of overs bowled, runs scored, and wickets lost in relation to the original target and remaining resources."
						}
					}
				]
			}
		])
	};

	const seoText = {
		title: "Interrupted Second Innings",
		description: `When rain or other interruptions occur during the second innings of a limited-overs cricket match, the Duckworth–Lewis–Stern (DLS) method is used to determine if the match has reached a result or to set a revised target if play can resume.
        
        Our calculator accurately implements the DLS method by considering the resource percentages of both teams. For the second innings, it specifically calculates the "Par Score"—the score the chasing team should have reached at a specific point for the match to be a tie. If the team's actual score is above the par score, they are winning; if below, they are losing.
        
        This tool is essential for fans, commentators, and analysts to understand the "DLS Par Score" in real-time during wet weather interruptions in ODI and T20 games.`,
		faqs: [
			{
				question: "What is a DLS Par Score?",
				answer: "The par score is the total a team should have scored to be equal with the opposition when a match is interrupted. If they are above it when play stops permanently, they win."
			},
			{
				question: "How many overs are needed for a DLS result?",
				answer: "In ODIs, at least 20 overs must be bowled in the second innings for a result. In T20s, it is usually 5 overs."
			}
		]
	};

	const [formData, setFormData] = useState<FormState>({
		runs_scored_by_team_1: '',
		overs_available_to_team_1_at_start: '',
		overs_available_to_team_2_at_start: '',
		overs_used_by_team_2_during_interruption: '',
		wickets_lost_by_team_2_during_interruption: '',
		revised_overs_to_team_2_after_resumption: '',
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

	const getExampleOvers = () => {
		switch (matchFormat) {
			case MatchFormat.T10: return "5.3";
			case MatchFormat.T20: return "10.2";
			case MatchFormat.ODI: return "25.4";
			default: return "25.4";
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

		if (data.runs_scored_by_team_1 !== '' && Number(data.runs_scored_by_team_1) < 0) {
			newErrors.runs_scored_by_team_1 = "Cannot be negative";
		}

		if (data.overs_available_to_team_1_at_start !== '') {
			const t1 = Number(data.overs_available_to_team_1_at_start);
			if (!validateOvers(data.overs_available_to_team_1_at_start)) newErrors.overs_available_to_team_1_at_start = "Invalid format (.0-.5)";
			else if (t1 > maxOvers) newErrors.overs_available_to_team_1_at_start = `Max ${maxOvers} overs allowed`;
		}

		if (data.overs_available_to_team_2_at_start !== '') {
			const ent = Number(data.overs_available_to_team_2_at_start);
			if (!validateOvers(data.overs_available_to_team_2_at_start)) newErrors.overs_available_to_team_2_at_start = "Invalid format (.0-.5)";
			else if (ent > maxOvers) newErrors.overs_available_to_team_2_at_start = `Max ${maxOvers} overs allowed`;
		}

		if (data.overs_used_by_team_2_during_interruption !== '') {
			const intr = Number(data.overs_used_by_team_2_during_interruption);
			if (!validateOvers(data.overs_used_by_team_2_during_interruption)) newErrors.overs_used_by_team_2_during_interruption = "Invalid format (.0-.5)";
			if (data.overs_available_to_team_2_at_start !== '' && intr > Number(data.overs_available_to_team_2_at_start)) newErrors.overs_used_by_team_2_during_interruption = "Cannot exceed entitled overs";
		}

		if (data.wickets_lost_by_team_2_during_interruption !== '') {
			const w = Number(data.wickets_lost_by_team_2_during_interruption);
			if (w < 0 || w > 9) newErrors.wickets_lost_by_team_2_during_interruption = "Must be 0 - 9";
		}

		if (data.revised_overs_to_team_2_after_resumption !== '') {
			const rev = Number(data.revised_overs_to_team_2_after_resumption);
			if (!validateOvers(data.revised_overs_to_team_2_after_resumption)) newErrors.revised_overs_to_team_2_after_resumption = "Invalid format (.0-.5)";
			if (data.overs_available_to_team_2_at_start !== '' && rev > Number(data.overs_available_to_team_2_at_start)) newErrors.revised_overs_to_team_2_after_resumption = "Cannot exceed original entitlement";
			if (data.overs_used_by_team_2_during_interruption !== '' && rev < Number(data.overs_used_by_team_2_during_interruption)) newErrors.revised_overs_to_team_2_after_resumption = "Cannot be less than overs bowled";
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
			runs_scored_by_team_1: '',
			overs_available_to_team_1_at_start: '',
			overs_available_to_team_2_at_start: '',
			overs_used_by_team_2_during_interruption: '',
			wickets_lost_by_team_2_during_interruption: '',
			revised_overs_to_team_2_after_resumption: '',
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
			scenario_type: ScenarioType.INTERRUPTED_INN_2,
			match_format: matchFormat,
			inputs: {
				runs_scored_by_team_1: Number(formData.runs_scored_by_team_1),
				overs_available_to_team_1_at_start: Number(formData.overs_available_to_team_1_at_start),
				overs_available_to_team_2_at_start: Number(formData.overs_available_to_team_2_at_start),
				overs_used_by_team_2_during_interruption: Number(formData.overs_used_by_team_2_during_interruption),
				wickets_lost_by_team_2_during_interruption: Number(formData.wickets_lost_by_team_2_during_interruption),
				revised_overs_to_team_2_after_resumption: Number(formData.revised_overs_to_team_2_after_resumption),
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

	const isFormComplete = Object.values(formData).every(val => val !== '');
	const hasErrors = Object.keys(errors).length > 0;
	const isFormEmpty = Object.values(formData).every(val => val === '');
	const inputBaseClass = "w-full px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none transition-all focus:ring-1 focus:ring-emerald-500/10 focus:scale-[1.01]";

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
						<div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl"><IconInn2Interrupted className="w-6 h-6" /></div>
						<div>
							<div className="flex items-center space-x-2">
								<h1 className="text-xl font-bold text-slate-800 dark:text-white">2nd Innings – Interrupted</h1>
								<button
									onClick={scrollToHelp}
									className="p-1 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
									title="How this works"
								>
									<HelpCircle className="w-4 h-4" />
								</button>
							</div>
							<p className="text-slate-500 text-sm mt-1">Calculate par scores/revised targets during chase interruption. Format: <span className="font-bold text-emerald-600">{matchFormat}</span></p>
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
									<h3 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">Team 1 (First Innings)</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Runs Scored</label>
										<input type="number" name="runs_scored_by_team_1" value={formData.runs_scored_by_team_1} onChange={handleInputChange} aria-label="Team 1 Total Runs" className={`${inputBaseClass} ${getInputBorderClass('runs_scored_by_team_1')}`} placeholder="e.g., 250" inputMode="decimal" required />
										{errors.runs_scored_by_team_1 && <p className="text-xs text-red-500 mt-1">{errors.runs_scored_by_team_1}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Overs Allocated</label>
										<input type="number" step="0.1" name="overs_available_to_team_1_at_start" value={formData.overs_available_to_team_1_at_start} onChange={handleInputChange} aria-label="Team 1 Starting Overs" className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_1_at_start')}`} placeholder={`e.g., ${getMaxOvers()}`} inputMode="decimal" required />
										{errors.overs_available_to_team_1_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_1_at_start}</p>}
									</div>
								</div>
							</div>
							<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
							<div className="space-y-4 md:col-span-2">
								<div className="flex items-center space-x-2 mb-3">
									<div className="w-[2px] h-4 bg-emerald-500 rounded-full" />
									<h3 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">At Interruption Point</h3>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team 2 Entitled Overs (Start)</label>
										<input type="number" step="0.1" name="overs_available_to_team_2_at_start" value={formData.overs_available_to_team_2_at_start} onChange={handleInputChange} aria-label="Team 2 Starting Overs" className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_2_at_start')}`} placeholder={`e.g., ${getMaxOvers()}`} inputMode="decimal" required />
										{errors.overs_available_to_team_2_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_2_at_start}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Overs Bowled (At Rain)</label>
										<input type="number" step="0.1" name="overs_used_by_team_2_during_interruption" value={formData.overs_used_by_team_2_during_interruption} onChange={handleInputChange} aria-label="Overs Played at Delay" className={`${inputBaseClass} ${getInputBorderClass('overs_used_by_team_2_during_interruption')}`} placeholder={`e.g., ${getExampleOvers()}`} inputMode="decimal" required />
										{errors.overs_used_by_team_2_during_interruption && <p className="text-xs text-red-500 mt-1">{errors.overs_used_by_team_2_during_interruption}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Wickets Lost</label>
										<input type="number" name="wickets_lost_by_team_2_during_interruption" value={formData.wickets_lost_by_team_2_during_interruption} onChange={handleInputChange} aria-label="Wickets Lost at Delay" className={`${inputBaseClass} ${getInputBorderClass('wickets_lost_by_team_2_during_interruption')}`} placeholder="0 - 9" inputMode="decimal" required />
										{errors.wickets_lost_by_team_2_during_interruption && <p className="text-xs text-red-500 mt-1">{errors.wickets_lost_by_team_2_during_interruption}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revised Total Overs</label>
										<input type="number" step="0.1" name="revised_overs_to_team_2_after_resumption" value={formData.revised_overs_to_team_2_after_resumption} onChange={handleInputChange} aria-label="Revised Overs Allocated" className={`${inputBaseClass} ${getInputBorderClass('revised_overs_to_team_2_after_resumption')}`} placeholder="e.g., 20" inputMode="decimal" required />
										{errors.revised_overs_to_team_2_after_resumption && <p className="text-xs text-red-500 mt-1">{errors.revised_overs_to_team_2_after_resumption}</p>}
									</div>
								</div>
							</div>
						</div>
						<div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center space-x-3">
							<button
								type="button"
								onClick={handleClearForm}
								disabled={isFormEmpty && !result && !apiError && !isConnError}
								className="flex items-center space-x-2 px-3 py-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
							>
								<RotateCcw className="w-4 h-4" />
								<span className="text-sm font-medium">Clear</span>
							</button>
							<button type="submit" disabled={loading || !isFormComplete || hasErrors} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50">
								<Save className="w-5 h-5" /><span>Calculate Target</span>
							</button>
						</div>
					</form>
				</div>
				<div className="lg:col-span-1 relative min-h-[350px]">
					<AnimatePresence mode="wait">
						{loading ? (
							<StadiumLoader key="loader" message="Calculating DLS Par Score" loading={true} />
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
								<p className="text-sm">Enter match details to see result.</p>
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<SEOContent id="how-it-works" {...seoText} />
		</main>
	);
};

export default InterruptedSecondInnings;
